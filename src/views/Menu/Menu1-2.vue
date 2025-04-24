<template>
  <div>
    <h1>页面二</h1>
    <p>当前计数：{{ counter.count }}</p>
    <el-button type="primary" @click="counter.increment">+1</el-button>
    <el-button type="primary" @click="counter.decrement">-1</el-button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore() // 获取 store 实例
</script>
