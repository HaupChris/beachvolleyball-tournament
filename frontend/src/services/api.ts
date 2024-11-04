// src/services/api.ts
import axios from 'axios';
import {ITournament, ITeam, IMatch, ICourt, ITournamentState} from '../types/api';

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

export const updateTournamentCourts = async (tournamentId: string, courts: string[]): Promise<void> => {
  await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/update_courts/`, { courts });
};

export const updateTeamPlayers = async (tournamentId: string, teams: string[][]): Promise<void> => {
  await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/update_team_players/`, { teams });
};

export const updateTournamentDetails = async (
  tournamentId: string,
  updatedDetails: Partial<Omit<ITournament, 'courts' | 'teams' | 'matches'>>
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tournaments/${tournamentId}/`, updatedDetails);
};

export const validateTournamentPin = async (tournamentId: number, pin: string): Promise<boolean> => {
  try {
    const response = await axios.post(`http://localhost:8000/api/tournaments/${tournamentId}/validate_pin/`, { pin });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Delete a tournament by ID.
 * @param id - The ID of the tournament to delete.
 * @returns A promise that resolves when the tournament is successfully deleted.
 */
export async function deleteTournament(id: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/tournaments/${id}/`);
    console.log('Tournament deleted successfully');
  } catch (error) {
    console.error('Error deleting tournament:', error);
    throw error;
  }
}

export const startTournament = async (tournamentId: number): Promise<void> => {
    await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/start_tournament/`);
};

export const getTournamentState = async (tournamentId: number): Promise<ITournamentState> => {
    const response = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/tournament_state/`);
    return response.data;
};

// src/services/api.ts

export const submitMatchResults = async (matches: IMatch[]): Promise<void> => {
    await axios.post(`${API_BASE_URL}/tournaments/update_matches/`, { matches });
};


// Function to create a dummy tournament
export function createDummyTournament(): ITournament{
    const tournamentId = Math.floor(Math.random() * 1000); // Random tournament ID
    const teams: ITeam[] = [];
    const courts: ICourt[] = [];
    const matches: IMatch[] = []


    return {
        id: tournamentId,
        name: 'Beach Volleyball Tournament',
        sets_to_win: 2,
        points_per_set: 21,
        players_per_team: 2,
        courts: courts,
        teams: teams,
        matches: matches,
        created_at: new Date().toDateString(),
        mode: 'round_robin_once', // Set tournament mode to round robin
        password: 'securepassword123',
        status: 'planned'
    };
};

