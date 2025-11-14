import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const PROJECT_SLUG = process.env.REACT_APP_PROJECT_SLUG || 'cite-kongo';

// Instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Projets
export const getProjetBySlug = async () => {
  try {
    const response = await api.get(`/projets/public/${PROJECT_SLUG}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Contenus
export const getContenusBySection = async (projetId, section) => {
  try {
    const response = await api.get(`/contenus/public/${projetId}/section/${section}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllContenus = async (projetId) => {
  try {
    const response = await api.get(`/contenus/public/${projetId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Questionnaire
export const submitQuestionnaire = async (data) => {
  try {
    const response = await api.post('/questionnaires/submit', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logements
export const getLogementsByProjet = async (projetId) => {
  try {
    const response = await api.get(`/logements/projet/${projetId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
