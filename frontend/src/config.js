// frontend/src/config.js

const raw = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://your-backend.vercel.app' : 'http://localhost:5000')
const base = raw.replace(/\/+$/, '')
export const API_BASE_URL = base.endsWith('/api') ? base : `${base}/api`

