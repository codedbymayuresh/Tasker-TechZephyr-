import axios from 'axios';

// Single shared axios instance for the whole app.
// Hardcoded Render URL to bypass Vercel environment variable issues completely.
const api = axios.create({
  baseURL: 'https://tasker-techzephyr.onrender.com/api',
});

// Attaches the JWT (if we have one saved) to every outgoing request,
// so we don't have to remember to do it manually in every component.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever says "your token is invalid/expired" (401),
// clear it out so the app doesn't keep sending a dead token.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;