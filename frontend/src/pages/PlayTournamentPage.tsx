import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { getTournamentState, submitMatchResults } from '../services/api';
import {ITournamentState, IMatch, ISet} from '../types/api';
import {getTeamName} from "../services/helpers";

const PlayTournamentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tournamentState, setTournamentState] = useState<ITournamentState | null>(null);

    useEffect(() => {
        const fetchState = async () => {
            const data = await getTournamentState(Number(id));
            setTournamentState(data);
        };
        fetchState();
    }, [id]);

    const handleSetScoreChange = (matchId: number, setIndex: number, team: 'team1' | 'team2', score: number) => {
        setTournamentState(prevState => {
            if (!prevState) return prevState;
            const updatedMatches = prevState.upcoming_matches.map(match => {
                if (match.id !== matchId) return match;
                const updatedSets = match.sets.map((set, index) =>
                    index === setIndex ? { ...set, [`score_${team}`]: score } : set
                );
                return { ...match, sets: updatedSets };
            });
            return { ...prevState, upcoming_matches: updatedMatches };
        });
    };

    const handleSaveResults = async () => {
        if (!tournamentState) return;
        await submitMatchResults(tournamentState.upcoming_matches);
    };

    if (!tournamentState) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {tournamentState.name} - Aktueller Spielstand
            </Typography>

            <Typography variant="h5">Gespielte Spiele</Typography>
            {tournamentState.played_matches.map((match: IMatch) => (
                <Box key={match.id} my={2}>
                    <Typography>
                        {getTeamName(match.team1)} vs {getTeamName(match.team2)} - {match.final_score}
                    </Typography>
                </Box>
            ))}

            <Typography variant="h5" style={{ marginTop: '1em' }}>Bevorstehende Spiele</Typography>
            {tournamentState.upcoming_matches.map((match: IMatch) => (
                <Box key={match.id} my={2}>
                    <Typography variant="h6">
                        {getTeamName(match.team1)} vs {getTeamName(match.team2)}
                    </Typography>
                    {match.sets.map((set: ISet, index) => (
                        <Box key={index} display="flex" alignItems="center" mt={1}>
                            <TextField
                                label={`Satz ${index + 1} - ${getTeamName(match.team1)}`}
                                type="number"
                                value={set.score_team1 || ''}
                                onChange={(e) => handleSetScoreChange(match.id, index, 'team1', Number(e.target.value))}
                                style={{ marginRight: 8 }}
                            />
                            <TextField
                                label={`Satz ${index + 1} - ${getTeamName(match.team2)}`}
                                type="number"
                                value={set.score_team2 || ''}
                                onChange={(e) => handleSetScoreChange(match.id, index, 'team2', Number(e.target.value))}
                            />
                        </Box>
                    ))}
                </Box>
            ))}

            <Button variant="contained" color="primary" onClick={handleSaveResults} style={{ marginTop: '1em' }}>
                Ergebnisse speichern
            </Button>
        </Container>
    );
};

export default PlayTournamentPage;
