import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ag_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Callbacks branchés par main.js une fois Pinia/router prêts,
// pour éviter les dépendances circulaires (client <-> store).
let onUnauthorized = () => {};
let onError = () => {};

export function registerClientHandlers({ unauthorized, error }) {
  if (unauthorized) onUnauthorized = unauthorized;
  if (error) onError = error;
}

client.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401) {
      onUnauthorized();
    } else {
      onError(err.response?.data?.message || 'Une erreur est survenue.');
    }
    return Promise.reject(err);
  }
);

export default client;
