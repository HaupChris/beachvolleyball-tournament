import {ITournament} from "../types/api";
import {Box, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import React from "react";
import {Form} from "react-router-dom";

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

        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            fullWidth
            value={tournament.mode}
            label="Modus"
            onChange={(e) => props.updateTournamentDetail('mode', e.target.value)}
        >
            <MenuItem value={"round_robin"}>Jeder gegen Jeden</MenuItem>
            <MenuItem value={"knockout"}>K.O. System</MenuItem>

        </Select>

    </Box>;
}
