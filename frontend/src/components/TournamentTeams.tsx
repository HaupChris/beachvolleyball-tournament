import React, {useEffect, useState} from 'react';
import {ITeam, ITournament, IPlayer} from "../types/api";
import Grid from '@mui/material/Grid2';
import {Box, Card, CardContent, Typography, Button, TextField, IconButton, CardHeader} from "@mui/material";
import {AddCircleOutline, Close, DeleteOutline} from '@mui/icons-material';

interface IProps {
    tournament: ITournament
    updateTeams: (updatedTeams: ITeam[]) => void
}

export function TournamentTeams({tournament, updateTeams}: IProps) {
    const [newPlayer, setNewPlayer] = useState<IPlayer>({
        first_name: '',
        last_name: '',
        skill_level: 0,
    });
    const [selectedTeamIdx, setSelectedTeamIdx] = useState<number | null>(null);


    useEffect(() => {
        if (tournament.teams.length < tournament.number_of_teams) {

            const updatedTeams = [...tournament.teams, {
                players: [],
                id: tournament.teams.length,
                tournament: tournament.id
            } as unknown as ITeam];
            updateTeams(updatedTeams);


            console.log("useeffect courtnames not enough")
            const m = tournament.teams.length;
            const n = tournament.number_of_teams;
            const missingTeamsIds = Array.from(Array(n - m).keys()).map(num => num + 1 + m);

            const newTeams: ITeam[] = missingTeamsIds.map((number) => {
                    return {
                        players: [],
                        id: number,
                        tournament: tournament.id
                    }
                }
            )
            console.log(newTeams, m, n, missingTeamsIds)
            updateTeams(tournament.teams.concat(newTeams));
        } else {
            if (tournament.teams.length > tournament.number_of_teams) {
                const updatedTeams = tournament.teams.slice(0, tournament.number_of_teams);
                updateTeams(updatedTeams);
            }
        }
    }, [])

    // Handle adding a player to a team
    const handleAddPlayer = (teamIdx: number) => {
        if (!newPlayer.first_name || !newPlayer.last_name) return;

        const updatedTeams = [...tournament.teams];
        updatedTeams[teamIdx].players.push({...newPlayer});
        updateTeams(updatedTeams);
        setNewPlayer({first_name: '', last_name: '', skill_level: 0}); // Reset player input
        setSelectedTeamIdx(null); // Close input for new player
    };

    function handleDeleteTeam(teamIdx: number) {
        const teams = tournament.teams.filter((team, idx) => idx !== teamIdx)
        updateTeams(teams);
    }

    // Handle deleting a player from a team
    const handleDeletePlayer = (teamIdx: number, playerIdx: number) => {
        const updatedTeams = [...tournament.teams];
        updatedTeams[teamIdx].players.splice(playerIdx, 1);
        updateTeams(updatedTeams);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                {tournament.teams.map((team, teamIdx) => (
                    <Grid>
                        <Card>
                            <CardHeader
                                action={
                                    <IconButton onClick={() => handleDeleteTeam(teamIdx)} aria-label="settings">
                                        <Close/>
                                    </IconButton>
                                }
                                title={
                                    <Typography variant="h6" gutterBottom>
                                        {team.players.length >= tournament.players_per_team ?
                                            // Sort players by last name and display their last names
                                            team.players
                                                .sort((a, b) => a.last_name.localeCompare(b.last_name))
                                                .map(player => player.last_name)
                                                .join(' ')  // Join all last names with a space
                                            :
                                            "Team " + (teamIdx + 1) // Fallback to a default team name if the number of players is less than expected
                                        }
                                    </Typography>
                                }
                            >


                            </CardHeader>
                            <CardContent>

                                {team.players.map((player, playerIdx) => (
                                    <Box key={playerIdx} display="flex" justifyContent="space-between"
                                         alignItems="center">
                                        <Typography variant="body1">
                                            {player.first_name} {player.last_name}, Skill: {player.skill_level}
                                        </Typography>
                                        <IconButton onClick={() => handleDeletePlayer(teamIdx, playerIdx)}>
                                            <DeleteOutline/>
                                        </IconButton>
                                    </Box>
                                ))}

                                {/* Add Player Input */}
                                {selectedTeamIdx === teamIdx ? (
                                        <Box mt={2}>
                                            <TextField
                                                label="Vorname"
                                                value={newPlayer.first_name}
                                                onChange={(e) => setNewPlayer({...newPlayer, first_name: e.target.value})}
                                                fullWidth
                                                margin="dense"
                                            />
                                            <TextField
                                                label="Nachname"
                                                value={newPlayer.last_name}
                                                onChange={(e) => setNewPlayer({...newPlayer, last_name: e.target.value})}
                                                fullWidth
                                                margin="dense"
                                            />
                                            <TextField
                                                label="Niveau Einstufung"
                                                type="number"
                                                value={newPlayer.skill_level}
                                                onChange={(e) => setNewPlayer({
                                                    ...newPlayer,
                                                    skill_level: parseInt(e.target.value)
                                                })}
                                                fullWidth
                                                margin="dense"
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleAddPlayer(teamIdx)}
                                                fullWidth
                                                style={{marginTop: '10px'}}
                                            >
                                                Spieler hinzufügen
                                            </Button>
                                        </Box>
                                    ) :
                                    <>
                                        {
                                            tournament.players_per_team > team.players.length ? (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<AddCircleOutline/>}
                                                    onClick={() => setSelectedTeamIdx(teamIdx)}
                                                    fullWidth
                                                    style={{marginTop: '10px'}}
                                                >
                                                    Spieler hinzufügen
                                                </Button>
                                            ) : null
                                        }
                                    </>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Option to add a new team */}
                {tournament.teams.length < tournament.number_of_teams && (
                    <Grid>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddCircleOutline/>}
                            fullWidth
                            onClick={() => {
                                const updatedTeams = [...tournament.teams, {
                                    players: [],
                                    id: tournament.teams.length,
                                    tournament: tournament.id
                                } as unknown as ITeam];
                                updateTeams(updatedTeams);
                            }}
                        >
                            Team hinzufügen
                        </Button>
                    </Grid>
                )}
            </Grid>

            {tournament.teams.length === tournament.number_of_teams && (
                <Typography variant="body1" color="textSecondary" align="center" style={{marginTop: '20px'}}>
                    Maximale Anzahl an Teams erreicht
                </Typography>
            )}
        </Box>
    );
}
