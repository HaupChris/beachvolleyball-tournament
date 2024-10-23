// src/pages/TournamentDetailPage.tsx
import React, {useEffect, useState} from 'react';
import {Container, Typography, Grid} from '@mui/material';
import {useParams} from 'react-router-dom';
import {fetchTournamentDetails} from '../services/api';
import {ITournament} from "../types/api";

const TournamentDetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [tournament, setTournament] = useState<ITournament | undefined>();

    useEffect(() => {
        if (id !== undefined) {
            const getTournament = async () => {
                const data = await fetchTournamentDetails(id);
                setTournament(() => data);
            };
            getTournament();
        }

    }, [id]);

    if (!tournament) return <div>Lade Turnierdaten...</div>;

    return (
        <Container>
            <Typography variant="h4">{tournament.name}</Typography>
            <Typography variant="body1">Teams: {tournament.teams.length}</Typography>
            <Typography variant="body1">Sätze zum Gewinn: {tournament.sets_to_win}</Typography>
            <Typography variant="body1">Punkte pro Satz: {tournament.points_per_set}</Typography>

            {/* Hier können Details zu Spielen und Teams hinzugefügt werden */}
            <Grid container spacing={2}>
                {/* Spielplan / Teams anzeigen */}
            </Grid>
        </Container>
    );
};

export default TournamentDetailPage;
