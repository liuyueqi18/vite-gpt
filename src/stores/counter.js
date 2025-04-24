import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0) // 使用 ref 创建响应式数据

    function increment() {
      count.value++ // 增加计数
    }

    function decrement() {
      count.value-- // 减少计数
    }

    // 手动重置状态
    function reset() {
      count.value = 0
    }

    return { count, increment, decrement, reset }
  },
  {
    persist: true, // 启用持久化
  },
)
