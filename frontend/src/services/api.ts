// src/services/api.ts
import axios from 'axios';
import { ITournament, ITeam, IMatch } from '../types/api';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchTournaments = async (): Promise<ITournament[]> => {
  const response = await axios.get(`${API_BASE_URL}/tournaments/`);
  return response.data as ITournament[];
};

export const createTournament = async (tournament: Partial<ITournament>): Promise<ITournament> => {
  const response = await axios.post(`${API_BASE_URL}/tournaments/`, tournament);
  return response.data as ITournament;
};

export const fetchTournamentDetails = async (id: string): Promise<ITournament> => {
  const response = await axios.get(`${API_BASE_URL}/tournaments/${id}/`);
  return response.data as ITournament;
};
