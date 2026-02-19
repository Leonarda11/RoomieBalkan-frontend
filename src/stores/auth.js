import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isSuperadmin: (state) => state.user?.role === 'superadmin',
  },

  actions: {
    async register(name, email, password, role = 'user') {
      try {
        const res = await api.post('/register', {
          name,
          email,
          password,
          password_confirmation: password,
          role
        })
        this.token = res.data.token
        this.user = res.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (err) {
        alert(err.response?.data?.message || 'Greška pri registraciji')
        return false
      }
    },

    async login(email, password) {
      try {
        const res = await api.post('/login', { email, password })
        this.token = res.data.token
        this.user = res.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (err) {
        alert(err.response?.data?.message || 'Neispravni kredencijali')
        return false
      }
    },

    async logout() {
      try {
        await api.post('/logout')
      } catch (err) {
        console.error('Logout error:', err)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }
})