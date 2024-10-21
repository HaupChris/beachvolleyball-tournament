import {ITournament} from "../types/api";
import {Box, TextField} from "@mui/material";
import React from "react";

interface IProps {
    tournament: ITournament
    updateTournamentDetail: (attribute: keyof Omit<ITournament, 'courts' | 'teams' | 'matches'>, value: any) => void
}

export function TournamentDetails(props: IProps) {
    const tournament = props.tournament;

    return <Box>
        <TextField
            label="Turniername"
            value={tournament.name}
            onChange={(e) => props.updateTournamentDetail('name', e.target.value)}
            fullWidth
            margin="normal"
            required
        />
        <TextField
            label="Anzahl der Teams"
            type="number"
            value={tournament.number_of_teams}
            onChange={(e) => props.updateTournamentDetail('number_of_teams', parseInt(e.target.value))}
            fullWidth
            margin="normal"
        />
        <TextField
            label="Anzahl Spieler pro Team"
            type="number"
            value={tournament.players_per_team}
            onChange={(e) => props.updateTournamentDetail('players_per_team', parseInt(e.target.value))}
            fullWidth
            margin="normal"
        />
        <TextField
            label="Anzahl der Felder"
            type="number"
            value={tournament.number_of_courts}
            onChange={(e) => props.updateTournamentDetail('number_of_courts', parseInt(e.target.value))}
            fullWidth
            margin="normal"
        />
        <TextField
            label="Gewinnsätze"
            type="number"
            value={tournament.sets_to_win}
            onChange={(e) => props.updateTournamentDetail('sets_to_win', parseInt(e.target.value))}
            fullWidth
            margin="normal"
        />
        <TextField
            label="Punkte pro Satz"
            type="number"
            value={tournament.points_per_set}
            onChange={(e) => props.updateTournamentDetail('points_per_set', parseInt(e.target.value))}
            fullWidth
            margin="normal"
        />
    </Box>;
}
