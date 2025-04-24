<template>
  <template v-for="item in menus" :key="item.path">
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <component
          :is="Icons[item.meta?.icon]"
          v-if="item.meta?.icon"
          class="menu-icon"
          style="width: 18px; height: 18px; padding-right: 6px"
        />
        <span>{{ item.meta?.title }}</span>
      </template>
      <SidebarMenu :menus="item.children" />
    </el-sub-menu>

    <el-menu-item v-else :index="item.path">
      <component
        :is="Icons[item.meta?.icon]"
        v-if="item.meta?.icon"
        class="menu-icon"
        style="width: 18px; height: 18px; padding-right: 6px"
      />
      <span>{{ item.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup>
import * as Icons from '@element-plus/icons-vue'

const props = defineProps({
  menus: Array,
})
</script>

<style scoped></style>
