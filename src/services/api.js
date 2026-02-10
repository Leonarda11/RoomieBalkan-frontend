import axios from 'axios'

const api = axios.create({
  baseURL: 'http://pzi122026.studenti.sum.ba/backend/api',
  headers: { Accept: 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
