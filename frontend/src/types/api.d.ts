

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
    number_of_teams: number;
    sets_to_win: number;
    points_per_set: number;
    number_of_courts: number;
    players_per_team: number;
    courts: ICourt[];
    teams: ITeam[];         // Liste von Teams
    matches: IMatch[];      // Liste von Spielen (Match)
    created_at: string;     // Zeitstempel
    mode: 'round_robin' | 'knockout';  // Turniermodus
    password: string;
}
