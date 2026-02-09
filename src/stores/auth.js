import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async login(email, password) {
      try {
        const res = await api.post('/login', { email, password })
        this.token = res.data.token     
        this.user = res.data.user
        localStorage.setItem('token', this.token)
        return true
      } catch (err) {
        console.error('Login failed:', err.response?.data?.message || err.message)
        return false
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
