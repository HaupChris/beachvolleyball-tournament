import React, {useState, useEffect} from 'react';
import {Container, Button, Typography} from '@mui/material';
import {createDummyTournament, fetchTournamentDetails} from '../services/api';
import {useParams} from 'react-router-dom';
import {ITeam, ITournament} from "../types/api";
import {TournamentDetails} from "../components/TournamentDetails";
import {TournamentTeams} from "../components/TournamentTeams";



function updateTournamentAttributes(
    tournament: ITournament,
    updates: Partial<Omit<ITournament, 'courts' | 'teams' | 'matches'>>
): ITournament {
    return {
        ...tournament,
        ...updates,
    };
}

const EditTournamentPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [tournament, setTournament] = useState<ITournament>(createDummyTournament());  // Load tournament data



    useEffect(() => {
        if (id !== undefined) {
            const loadTournament = async () => {
                const data = await fetchTournamentDetails(id);
                setTournament(data);
            };
            loadTournament().then();
        }
    }, [id]);


    const handleAttributeChange = (attribute: keyof Omit<ITournament, 'courts' | 'teams' | 'matches'>, value: any) => {
        if (tournament) {
            setTournament(updateTournamentAttributes(tournament, {[attribute]: value}));
        }
    };

    // Add, remove, or update teams and players
    const updateTeams = (updatedTeams: ITeam[]) => {
        setTournament((prevTournament) => ({
            ...prevTournament,
            teams: updatedTeams,
        }));
    };


    if (!tournament) return <div>Lade Turnierdaten...</div>;

    return (
        <Container>
            <Typography variant={"h4"}>Turnier <strong>{tournament.name}</strong> bearbeiten</Typography>
            {/*<TournamentDetails tournament={tournament} updateTournamentDetail={handleAttributeChange}/>*/}
            <TournamentTeams tournament={tournament} updateTeams={updateTeams}/>

            {/*<Box>*/}
            {/*    {courtNames.map((name, index) => (*/}
            {/*        <TextField*/}
            {/*            key={index}*/}
            {/*            label={`Feld ${index + 1}`}*/}
            {/*            value={name}*/}
            {/*            onChange={(e) => handleCourtNameChange(index, e.target.value)}*/}
            {/*            fullWidth*/}
            {/*            margin="normal"*/}
            {/*        />*/}
            {/*    ))}*/}

            {/*    {teamPlayers.map((players, teamIndex) => (*/}
            {/*        <Box key={teamIndex} mb={3}>*/}
            {/*            <h3>Team {teamIndex + 1}</h3>*/}
            {/*            {players.map((playerName, playerIndex) => (*/}
            {/*                <TextField*/}
            {/*                    key={playerIndex}*/}
            {/*                    label={`Spieler ${playerIndex + 1}`}*/}
            {/*                    value={playerName}*/}
            {/*                    onChange={(e) => handlePlayerNameChange(teamIndex, playerIndex, e.target.value)}*/}
            {/*                    fullWidth*/}
            {/*                    margin="normal"*/}
            {/*                />*/}
            {/*            ))}*/}
            {/*        </Box>*/}
            {/*    ))}*/}

            <Button variant="contained" color="primary">
                Änderungen speichern
            </Button>
            {/*</Box>*/}
        </Container>
    );
};

export default EditTournamentPage;
