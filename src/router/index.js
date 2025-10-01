import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/userList',
      name: 'userList',
      component: () => import('../views/UserListView.vue'),
    },
    {
      path: '/userModifyView/:id',
      name: 'userModifyView',
      component: () => import('../views/UserModifyView.vue'),
      props: true,
    },
    {
      path: '/userReg',
      name: 'userReg',
      component: () => import('../views/UserRegView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },

  ],

})

export default router
