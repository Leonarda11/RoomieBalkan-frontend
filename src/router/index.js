import { createRouter, createWebHistory } from 'vue-router'
import Ads from '../views/Ads.vue'
import AddAd from '../views/AddAd.vue'
import Auth from '../views/Auth.vue'

const routes = [
  { path: '/', redirect: '/auth' },

  { path: '/auth', name: 'Auth', component: Auth },

  { path: '/ads', name: 'Ads', component: Ads },

  { 
    path: '/add-ad', 
    name: 'AddAd', 
    component: AddAd,
    meta: { requiresAdmin: true }
  },

  // fallback
  { path: '/:pathMatch(.*)*', redirect: '/ads' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 Auth & role guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('currentUser'))

  if (to.meta.requiresAdmin && (!user || !['admin','super_admin'].includes(user.role))) {
    next('/ads')
  } else {
    next()
  }
})

export default router