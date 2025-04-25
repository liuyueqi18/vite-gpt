<template>
  <div class="layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="aside" :style="{ width: isCollapsed ? '60px' : '200px' }">
        <Sidebar :menus="menuItems" :collapse="isCollapsed" />
      </el-aside>

      <el-container class="container">
        <el-header class="header">
          <div class="header-left">
            <el-icon
              class="header-left-icon"
              @click="isCollapsed = !isCollapsed"
              v-if="!isCollapsed"
            >
              <Fold />
            </el-icon>
            <el-icon class="header-left-icon" @click="isCollapsed = !isCollapsed" v-else>
              <Expand />
            </el-icon>
            <div style="width: 10px"></div>
            <el-breadcrumb class="breadcrumb">
              <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
                <span>{{ item.meta?.title }}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-header>
        <el-main><RouterView /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false) // 控制侧边栏是否折叠

const menuItems = router.options.routes[0].children

// 计算面包屑路径
const breadcrumb = computed(() => {
  const segments = route.path.split('/')
  const breadcrumbs = []

  for (let i = 1; i < segments.length; i++) {
    const path = segments.slice(0, i + 1).join('/')
    const menuItem = findMenuItem(path, menuItems)
    if (menuItem) {
      breadcrumbs.push(menuItem)
    }
  }
  return breadcrumbs
})

// 查找菜单项
function findMenuItem(path, menus) {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu
    }
    if (menu.children) {
      const found = findMenuItem(path, menu.children)
      if (found) {
        return found
      }
    }
  }
  return null
}

onMounted(() => {
  console.log('%c当前环境：' + import.meta.env.VITE_APP_ENV, 'color: green; font-weight: bold;')
})
</script>

<style scoped>
.layout {
  height: 100vh;
  width: 100%;
  display: flex;
}
.el-menu {
  border-right: none;
}

.el-aside {
  height: 100%;
  max-width: 200px;
  background-color: #545c64;
  transition: width 0.3s ease;
}

.header-left-icon {
  cursor: pointer;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #545c64;
}
.header-left {
  display: flex;
  align-items: center;
}

.container {
  height: 100%;
  flex: 1;
}
</style>
