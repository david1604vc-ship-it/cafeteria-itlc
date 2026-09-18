import axios from 'axios'

// Normaliza la URL de la API: agrega /api si falta y quita slashes sobrantes
const raw = (import.meta.env.VITE_API_URL || 'https://7cqf48gr-4000.usw3.devtunnels.ms/api').replace(/\/+$/, '')
const baseURL = raw.endsWith('/api') ? raw : `${raw}/api`

const api = axios.create({
  baseURL
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