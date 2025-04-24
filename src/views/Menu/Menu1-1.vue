<template>
  <div>
    <h1>页面一</h1>
    <p>当前计数：{{ counter.count }}</p>
    <el-button type="primary" @click="counter.increment">+1</el-button>
    <el-button type="primary" @click="counter.decrement">-1</el-button>
    <el-button type="primary" @click="handleClear">清空</el-button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore() // 获取 store 实例

const handleClear = () => {
  // 手动重置 store 状态
  counter.reset()

  // 手动清除持久化数据
  localStorage.removeItem('counter') // 清除特定 store 的持久化数据
}
</script>
