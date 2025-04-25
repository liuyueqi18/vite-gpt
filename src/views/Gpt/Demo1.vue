<template>
  <div class="gpt-page">
    <div class="chat-list" ref="chatList">
      <div
        v-for="(item, i) in list"
        :key="i"
        :class="['chat-item', item.role === 'user' ? 'from-user' : 'from-gpt']"
      >
        <div class="avatar">{{ item.role === 'user' ? '我' : 'GPT' }}</div>
        <div class="bubble">{{ item.content }}</div>
      </div>
    </div>

    <div class="bottom-input">
      <el-input
        v-model="searchText"
        style="width: 100%"
        :autosize="{ minRows: 3, maxRows: 3 }"
        placeholder="询问任何问题"
        @keyup.enter="handleUploadSearch"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CryptoJS from 'crypto-js'
import { useChatStore } from '@/stores/chatStore'

const chatStore = useChatStore()

// 输入框和消息列表
const searchText = ref('')
const list = ref([])
const chatList = ref(null)

let ttsWS = null // 用于存储 WebSocket 实例
let gptReply = '' // 用于拼接 GPT 回复

const APPID = 'd9c0b794'
const API_SECRET = 'YmViODk0ZWU2ZDI3MDRjMWFkNDY5YjM2'
const API_KEY = 'd804fa6358b2137db5932e24720130ef'

const handleSetList = () => {
  chatStore.setList(JSON.parse(JSON.stringify(list.value)))
}

const handleGetList = () => {
  if (chatStore.list?.length) {
    list.value = chatStore.list
  }
}

// 获取 WebSocket URL
function getWebsocketUrl() {
  let httpUrl = new URL('wss://spark-api.xf-yun.com/v1.1/chat')
  let modelDomain = 'lite' // 默认模型，适配不同版本可以修改
  var apiKey = API_KEY
  var apiSecret = API_SECRET

  var url = 'wss://' + httpUrl.host + httpUrl.pathname
  var host = location.host
  var date = new Date().toGMTString()
  var algorithm = 'hmac-sha256'
  var headers = 'host date request-line'
  var signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${httpUrl.pathname} HTTP/1.1`
  var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
  var signature = CryptoJS.enc.Base64.stringify(signatureSha)
  var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
  var authorization = btoa(authorizationOrigin)
  url = `${url}?authorization=${authorization}&date=${date}&host=${host}`

  return Promise.resolve(url)
}

// 处理用户输入和发送到 WebSocket
const handleUploadSearch = () => {
  const text = searchText.value.trim()
  if (!text) return

  // 添加用户消息
  gptReply = '' // 清空之前的回复，确保每次新问题都能正常接收新的回答

  // 如果有旧的 WebSocket 连接，先关闭它
  if (ttsWS) {
    ttsWS.close()
    ttsWS = null // 确保 WebSocket 实例被清空
  }

  // 获取 WebSocket URL并连接
  getWebsocketUrl().then((url) => {
    ttsWS = new WebSocket(url) // 创建新的 WebSocket 实例
    ttsWS.onopen = () => {
      // WebSocket 连接成功后发送消息
      list.value.push({ role: 'user', content: text })
      webSocketSend()
      searchText.value = ''
      handleSetList()
    }
    ttsWS.onmessage = (e) => {
      handleWebSocketMessage(e)
    }
    ttsWS.onerror = (e) => {
      console.error('WebSocket error:', e)
    }
    ttsWS.onclose = (e) => {
      console.log('WebSocket closed:', e)
    }
  })
}

// WebSocket 发送消息
const webSocketSend = () => {
  const params = {
    header: {
      app_id: APPID,
      uid: 'fd3f47e4-d',
    },
    parameter: {
      chat: {
        domain: 'lite', // 设置模型
        temperature: 0.5,
        max_tokens: 1024,
      },
    },
    payload: {
      message: {
        text: list.value,
      },
    },
  }
  ttsWS.send(JSON.stringify(params)) // 发送数据
}

// 处理 WebSocket 返回的消息
const handleWebSocketMessage = (e) => {
  const res = JSON.parse(e.data)
  const content = res?.payload?.choices?.text?.[0]?.content || ''

  if (content) {
    gptReply += content

    // 实时更新 GPT 消息
    const lastItem = list.value[list.value.length - 1]
    if (lastItem && lastItem.role === 'assistant') {
      lastItem.content = gptReply
    } else {
      // 如果没有 GPT 消息，插入新的一条
      list.value.push({
        role: 'assistant',
        content: gptReply,
      })
    }
    handleSetList()
    const chatListElement = chatList.value
    if (chatListElement) {
      chatListElement.scrollTop = chatListElement.scrollHeight
    }
  }

  // status = 2 表示数据接收完成
  if (res.header?.status === 2) {
    ttsWS.close() // 关闭 WebSocket 连接
    ttsWS = null // 清空 WebSocket 实例
  }
}

onMounted(() => {
  handleGetList()
})
</script>

<style scoped>
.gpt-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.chat-item {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.from-user {
  flex-direction: row-reverse;
}

.from-gpt {
  flex-direction: row;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #dcdfe6;
  border-radius: 50%;
  text-align: center;
  line-height: 36px;
  margin: 0 10px;
  font-weight: bold;
}

.bubble {
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 16px;
  background: #f2f2f2;
  word-break: break-word;
}

.from-user .bubble {
  background-color: #409eff;
  color: #fff;
}
</style>
