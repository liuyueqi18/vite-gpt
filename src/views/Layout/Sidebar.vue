<template>
  <el-menu
    :default-active="route.path"
    :default-openeds="openMenus"
    :collapse="collapse"
    router
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :unique-opened="true"
    :close-on-click-outside="true"
  >
    <SidebarMenu :menus="menus" />
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarMenu from './SidebarMenu.vue'

const route = useRoute()

const props = defineProps({
  menus: Array,
  collapse: Boolean,
})

const openMenus = computed(() => {
  const segments = route.path.split('/')
  const paths = []
  for (let i = 2; i < segments.length; i++) {
    paths.push(segments.slice(0, i).join('/'))
  }
  return paths
})
</script>
