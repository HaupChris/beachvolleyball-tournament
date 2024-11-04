export interface IPlayer {
    first_name: string;
    last_name: string;
    skill_level: number;
}

// Interface für ein Team
export interface ITeam {
    id: number;
    players: IPlayer[]
    tournament: number;  // Turnier-ID, zu dem das Team gehört
}

// Interface für ein Match
export interface IMatch {
    id: number;
    team1: ITeam;
    team2: ITeam;
    sets: ISet[];
    final_score: string; // Derived final score based on sets
}

export interface ISet {
    score_team1: number;
    score_team2: number;
    played_at: string | null;
}

export interface ICourt {
    name: string;
}

// Interface für ein Turnier
export interface ITournament {
    id: number;
    name: string;
    sets_to_win: number;
    points_per_set: number;
    players_per_team: number;
    courts: ICourt[];
    teams: ITeam[];         // Liste von Teams
    matches: IMatch[];      // Liste von Spielen (Match)
    created_at: string;     // Zeitstempel
    mode: 'single_elimination' | 'double_elimination' | 'group_elimination' | 'swiss' | 'round_robin_once' | 'round_robin_twice';  // Turniermodus
    status: 'planned' | 'started' | 'finished';
    password: string;
}

export interface ITournamentState {
    name: string;
    played_matches: IMatch[];
    upcoming_matches: IMatch[];
    current_state: any; // Adjust this based on your mode-specific data
}