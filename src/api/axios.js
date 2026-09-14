import axios from 'axios'

const api = axios.create({
  baseURL: 'https://7cqf48gr-4000.usw3.devtunnels.ms/api'
})

// Agrega el token automáticamente a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api