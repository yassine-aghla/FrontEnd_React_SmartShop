import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8088/smartshop/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error('Requête invalide:', error.response.data);
          break;
        case 404:
          console.error('Ressource non trouvée');
          break;
        case 422:
          console.error('Validation échouée:', error.response.data);
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur inconnue:', error.response.status);
      }
    }
    return Promise.reject(error);
  }
);

export default api;