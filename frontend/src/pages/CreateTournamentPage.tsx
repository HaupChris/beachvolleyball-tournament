// src/pages/CreateTournamentPage.tsx
import React, {useState} from 'react';
import {Container, TextField, Button, Box, Typography} from '@mui/material';
import {createTournament} from '../services/api';

const CreateTournamentPage: React.FC = () => {
    const [name, setName] = useState('');
    const [teams, setTeams] = useState(0);
    const [sets, setSets] = useState(0);
    const [points, setPoints] = useState(0);
    const [generatedPin, setGeneratedPin] = useState<string | null>(null);  // For storing the PIN
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error on form submit
        setGeneratedPin(null); // Reset PIN on form submit
        try {
            const tournament = {
                name: name,
                number_of_teams: teams,
                sets_to_win: sets,
                points_per_set: points,
                created_at: "a",
                password: "a"
            };
            const createdTournament = await createTournament(tournament);

            // Store the generated PIN
            setGeneratedPin(createdTournament.password);
        } catch (err) {
            setError('Failed to create tournament');
        }
    };


    return (
        <Container>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Turniername"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Anzahl der Teams"
                    type="number"
                    value={teams}
                    onChange={(e) => setTeams(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Gewinnsätze"
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Punkte pro Satz"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Turnier erstellen
                </Button>
            </Box>
            {/* Display the generated PIN after successful creation */}
            {generatedPin && (
                <Box mt={4}>
                    <Typography variant="h6" color="success.main">
                        Turnier erstellt! Der Ausrichter-PIN lautet: {generatedPin}
                    </Typography>
                    <Typography variant="body1">
                        Bitte notiere dir den PIN, da er für spätere Bearbeitungen des Turniers benötigt wird.
                    </Typography>
                </Box>
            )}

            {/* Show error message if the tournament creation failed */}
            {error && (
                <Typography variant="body1" color="error.main">
                    {error}
                </Typography>
            )}
        </Container>
    );
};

export default CreateTournamentPage;
