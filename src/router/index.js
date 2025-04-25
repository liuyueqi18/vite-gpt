import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    redirect: '/home', // 自动重定向到首页
    component: () => import('@/views/Layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: { title: '首页', icon: 'Menu' },
      },
      {
        path: '/menu1',
        name: 'Menu1',
        component: () => import('@/views/Menu/Menu1.vue'),
        meta: { title: '菜单1', icon: 'Tickets' },
        children: [
          {
            path: '/menu1/menu1-1',
            name: 'Menu1-1',
            component: () => import('@/views/Menu/Menu1-1.vue'),
            meta: { title: '菜单1-1' },
          },
          {
            path: '/menu1/menu1-2',
            name: 'Menu1-2',
            component: () => import('@/views/Menu/Menu1-2.vue'),
            meta: { title: '菜单1-2' },
          },
        ],
      },
      {
        path: '/gpt',
        name: 'Gpt',
        component: () => import('@/views/Gpt/Demo.vue'),
        meta: { title: 'GPT', icon: 'Tickets' },
        children: [
          {
            path: '/gpt/demo1',
            name: 'GptDemo1',
            component: () => import('@/views/Gpt/Demo1.vue'),
            meta: { title: 'GPT-1' },
          },
          {
            path: '/gpt/demo2',
            name: 'GptDemo2',
            component: () => import('@/views/Gpt/Demo2.vue'),
            meta: { title: 'GPT-2' },
          },
          {
            path: '/gpt/demo3',
            name: 'GptDemo3',
            component: () => import('@/views/Gpt/Demo3.vue'),
            meta: { title: 'GPT-3' },
          },
        ],
      },
      {
        path: '/menu2',
        name: 'Menu2',
        component: () => import('@/views/Menu/Menu2.vue'),
        meta: { title: '菜单2', icon: 'Tickets' },
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings/index.vue'),
        meta: { title: '系统设置', icon: 'Setting' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue'),
    meta: { title: '页面不存在' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '月亮屋' // 如果没有 meta.title，则使用默认标题
  next()
})

export default router
