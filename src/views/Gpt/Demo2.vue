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
import { ref, nextTick, onMounted } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useChatStore } from '@/stores/chatStore'

const chatStore = useChatStore()

const searchText = ref('')
const list = ref([])
const chatList = ref(null)

let controller = null
let gptReply = ''

const handleSetList = () => {
  chatStore.setList(JSON.parse(JSON.stringify(list.value)))
}

const handleGetList = () => {
  if (chatStore.list?.length) {
    list.value = chatStore.list
  }
}

const handleUploadSearch = async () => {
  if (!searchText.value.trim()) return

  controller = new AbortController()

  // const userQuery = searchText.value
  list.value.push({ role: 'user', content: searchText.value })

  // {
  //           "role": "assistant",
  //           "content": "你是知识渊博的助理"
  //       },
  fetchEventSource('/gpt-api/chat', {
    method: 'POST',
    body: JSON.stringify({ list: list.value }),
    headers: {
      'Content-Type': 'application/json',
    },
    onmessage(msg) {
      searchText.value = ''
      if (msg.data === '[DONE]') {
        gptReply = ''
        controller.abort()
        return
      }
      const res = JSON.parse(msg.data)
      const content = res.choices[0].delta.content || ''

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
    },
    onerror(err) {
      controller.abort()
      console.error('出错了:', err)
    },
  })
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
  content-align: center;
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
