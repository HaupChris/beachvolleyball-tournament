import {ITournament} from "../types/api";
import {Box, MenuItem, Select, TextField} from "@mui/material";
import React, {ChangeEvent} from "react";


interface IProps {
    tournament: ITournament
    updateTournamentDetail: (attribute: keyof Omit<ITournament, 'courts' | 'teams' | 'matches'>, value: any) => void
    updateNumberOfCourts: (newAmount: number) => void;
    updateNumberOfTeams: (newAmount: number) => void;
}

export function TournamentDetails(props: IProps) {
    const tournament = props.tournament;

    const handleChangeNumberOfTeams = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.valueAsNumber >= 0) {
            props.updateNumberOfTeams(event.target.valueAsNumber);
        }
    }

    const handleChangeNumberOfCourts = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.valueAsNumber >= 0) {
            props.updateNumberOfCourts(event.target.valueAsNumber);
        }
    }

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
            value={tournament.teams.length}
            onChange={handleChangeNumberOfTeams}
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
            value={tournament.courts.length}
            onChange={handleChangeNumberOfCourts}
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
            variant={"outlined"}
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
