import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore(
  'chat',
  () => {
    // 定义响应式数据 list 用来存储消息
    const list = ref([])

    // 添加用户消息
    // function addUserMessage(text) {
    //   list.value.push({
    //     id: 'user',
    //     text,
    //   })
    // }

    // // 添加 GPT 回复
    // function addGptMessage(text) {
    //   list.value.push({
    //     id: 'gpt',
    //     text,
    //   })
    // }

    // 清空消息列表
    function clearList() {
      list.value = []
    }

    const setList = (newList) => {
      list.value = newList
    }

    return { list, setList, clearList }
  },
  {
    persist: true, // 启用持久化
  },
)
