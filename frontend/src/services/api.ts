// src/services/api.ts
import axios from 'axios';
import {ITournament, ITeam, IMatch, ICourt} from '../types/api';

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

export const validateTournamentPin = async (tournamentId: string, pin: string): Promise<boolean> => {
  try {
    const response = await axios.post(`http://localhost:8000/api/tournaments/${tournamentId}/validate_pin/`, { pin });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};



// Helper function to create dummy players
// const createDummyPlayer = (firstName: string, lastName: string, skillLevel: number): IPlayer => {
//     return {
//         first_name: firstName,
//         last_name: lastName,
//         skill_level: skillLevel,
//     };
// };

// Helper function to create dummy teams
// const createDummyTeam = (id: number, tournamentId: number): ITeam => {
//     return {
//         id: id,
//         tournament: tournamentId,
//         players: [
//             createDummyPlayer('Player1', `Team${id}`, Math.floor(Math.random() * 10)),
//             createDummyPlayer('Player2', `Team${id}`, Math.floor(Math.random() * 10)),
//         ],
//     };
// };
//
// // Helper function to create dummy matches
// const createDummyMatch = (id: number, team1: ITeam, team2: ITeam): IMatch => {
//     return {
//         id: id,
//         team1: team1,
//         team2: team2,
//         score_team1: Math.floor(Math.random() * 25),
//         score_team2: Math.floor(Math.random() * 25),
//         played_at: null, // set to null initially, can be updated with actual timestamp when played
//     };
// };
//
// // Helper function to create dummy courts
// const createDummyCourt = (name: string): ICourt => {
//     return {
//         name: name,
//     };
// };

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
        created_at: new Date().toISOString(),
        mode: 'round_robin', // Set tournament mode to round robin
        password: 'securepassword123',
    };
};

