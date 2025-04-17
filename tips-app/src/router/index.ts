import { createRouter, createWebHistory } from 'vue-router'
import NewShiftView from '@/views/NewShiftView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NewShiftView,
    },
  ],
})

export default router
