import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const fetchQuestions = async () => {
  const response = await api.get('/questions');
  return response.data;
};

export const fetchPlayers = async () => {
  const response = await api.get('/players');
  return response.data;
};

export const fetchGameSessions = async () => {
  const response = await api.get('/game-sessions');
  return response.data;
};
