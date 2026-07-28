// frontend/src/config.js

export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

// Alias fallback so any import mismatch won't trigger missing export errors
export const API_URL = API_BASE_URL;