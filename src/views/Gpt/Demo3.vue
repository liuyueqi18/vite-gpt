<template>
  <div class="gpt-page">
    <div class="chat-list" ref="chatListRef">
      <BubbleList
        ref="bubbleListRef"
        :list="BubblelistData"
        :showBackButton="true"
        :btnLoading="false"
        :max-height="bubbleListRefMaxHeight"
      />
    </div>

    <div class="bottom-input">
      <Sender
        ref="senderRef"
        v-model="searchText"
        :loading="senderLoading"
        clearable
        @submit="handleUploadSearch"
      >
        <template #action-list>
          <div style="display: flex">
            <el-button
              type="primary"
              plain
              circle
              :loading="senderLoading"
              @click.stop="handleUploadSearch"
            >
              <el-icon><Top /></el-icon>
            </el-button>
            <el-button type="primary" circle :loading="senderLoading" @click="handleDeleteList">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </template>
      </Sender>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'
import { BubbleList, Sender } from 'vue-element-plus-x'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useChatStore } from '@/stores/chatStore'
import { ElMessageBox } from 'element-plus'

const chatStore = useChatStore()

const searchText = ref('') // 输入框搜索值
const list = ref([]) // 对话列表
const chatListRef = ref() // 对话列表ref

const bubbleListRef = ref() // 对话列表组件
const bubbleListRefMaxHeight = ref('') // 对话列表组件最大高度
const BubblelistData = computed(() => {
  return list.value.map((i) => {
    return {
      ...i,
      placement: i.role === 'user' ? 'end' : 'start',
    }
  })
})

const senderLoading = ref(false)

let controller = null
let gptReply = ''

const handleGetList = () => {
  bubbleListRefMaxHeight.value = chatListRef.value.offsetHeight + 'px'
  nextTick(() => {
    if (chatStore.list?.length) {
      list.value = chatStore.list
      bubbleListRef.value?.scrollToBottom()
    }
  })
}

const handleSetList = () => {
  chatStore.value = chatStore.setList(JSON.parse(JSON.stringify(list.value)))
}

const handleDeleteList = () => {
  ElMessageBox.confirm('是否清除对话?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      list.value = []
      handleSetList()
    })
    .catch(() => {
      //
    })
}

const handleUploadSearch = async () => {
  if (!searchText.value.trim()) return

  if (controller) {
    controller.abort()
    controller = null
  }

  list.value.push({ role: 'user', content: searchText.value })
  searchText.value = ''

  controller = new AbortController()

  senderLoading.value = true

  fetchEventSource('/gpt-api/chat', {
    method: 'POST',
    body: JSON.stringify({ list: list.value }),
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    onmessage(msg) {
      if (msg.data === '[DONE]') {
        gptReply = ''
        controller.abort()
        senderLoading.value = false
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
        bubbleListRef.value?.scrollToBottom()
      }
    },
    onerror(err) {
      controller.abort()
      senderLoading.value = false
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
  box-sizing: border-box;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}
</style>
