// frontend/src/auth.js
// Stores the login token in localStorage and provides it as an
// Authorization header for authenticated requests. Used instead of
// relying on cookies, since the frontend and backend live on different
// domains and modern browsers can block cross-domain cookies.

const TOKEN_KEY = 'noteapp_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
