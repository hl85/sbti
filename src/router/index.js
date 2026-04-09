import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/TestView.vue')
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('../views/ResultView.vue')
  },
  {
    path: '/share/:type',
    name: 'Share',
    component: () => import('../views/ShareView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
