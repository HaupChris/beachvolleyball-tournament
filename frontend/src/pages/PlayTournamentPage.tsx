import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    TextField,
    Box,
    Tab,
    Tabs,
    Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid2';  // Updated import as provided
import { createDummyTournament, fetchTournamentDetails, getTournamentState, submitMatchResults } from '../services/api';
import { ITournamentState, IMatch, ISet, ITournament } from '../types/api';
import { getTeamName } from "../services/helpers";

const PlayTournamentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tournamentState, setTournamentState] = useState<ITournamentState | null>(null);
    const [tournament, setTournament] = useState<ITournament>(createDummyTournament());
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        const fetchState = async () => {
            const data = await getTournamentState(Number(id));
            setTournamentState(data);
        };
        const fetchTournament = async () => {
            if (id !== undefined) {
                const newTournament = await fetchTournamentDetails(id);
                if (newTournament !== null) {
                    setTournament(newTournament);
                }
            }
        };

        fetchState().then();
        fetchTournament().then();
    }, [id]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

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
            <Typography variant="h4" gutterBottom align="center">
                {tournament.name}
            </Typography>

            {/* Tab Navigation */}
            <Tabs value={selectedTab}
                  onChange={handleTabChange}
                  variant={"scrollable"}
                  scrollButtons
                  allowScrollButtonsMobile
            >
                <Tab label="Bevorstehende Spiele" />
                <Tab label="Aktuelle Stände" />
                <Tab label="Gespielte Spiele" />
                <Tab label="Turnier Einstellungen" />
            </Tabs>

            {/* Tab Content */}
            {selectedTab === 0 && (
                <Box mt={3}>
                    <Typography variant="h5">Bevorstehende Spiele</Typography>
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
                </Box>
            )}

            {selectedTab === 1 && (
                <Box mt={3}>
                    <Typography variant="h5">Aktuelle Stände</Typography>
                    <Box>
                        {Array.isArray(tournamentState.current_state) ? (
                            <Paper>
                                <Typography variant="h6" gutterBottom align="center">
                                    Tabellenstand
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid><Typography>Team</Typography></Grid>
                                    <Grid><Typography>Siege</Typography></Grid>
                                    <Grid><Typography>Niederlagen</Typography></Grid>
                                </Grid>
                                {tournamentState.current_state.map((team: any) => (
                                    <Grid container key={team.team} spacing={2}>
                                        <Grid><Typography>{team.team}</Typography></Grid>
                                        <Grid><Typography>{team.wins}</Typography></Grid>
                                        <Grid><Typography>{team.losses}</Typography></Grid>
                                    </Grid>
                                ))}
                            </Paper>
                        ) : (
                            <Typography>Aktuelle Turnierstruktur anzeigen (Bracket)</Typography>
                        )}
                    </Box>
                </Box>
            )}

            {selectedTab === 2 && (
                <Box mt={3}>
                    <Typography variant="h5">Gespielte Spiele</Typography>
                    {tournamentState.played_matches.map((match: IMatch) => (
                        <Box key={match.id} my={2}>
                            <Typography>
                                {getTeamName(match.team1)} vs {getTeamName(match.team2)} - Endstand: {match.final_score}
                            </Typography>
                            <Box display="flex" flexWrap="wrap">
                                {match.sets.map((set: ISet, index) => (
                                    <Typography key={index} style={{ marginRight: '1em' }}>
                                        Satz {index + 1}: {set.score_team1} - {set.score_team2}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {selectedTab === 3 && (
                <Box mt={3}>
                    <Typography variant="h5">Turnier Einstellungen</Typography>
                    <Typography>Modus: {tournament.mode}</Typography>
                    <Typography>Spieler pro Team: {tournament.players_per_team}</Typography>
                    <Typography>Sätze zum Sieg: {tournament.sets_to_win}</Typography>
                    <Typography>Punkte pro Satz: {tournament.points_per_set}</Typography>
                </Box>
            )}
        </Container>
    );
};

export default PlayTournamentPage;
