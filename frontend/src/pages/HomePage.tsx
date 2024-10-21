import React, {useEffect, useState} from 'react';
import {Button, Container, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import Grid from '@mui/material/Grid2'; // Updated the correct Grid import
import TournamentCard from '../components/TournamentCard';
import {fetchTournaments, validateTournamentPin} from '../services/api';
import {ITournament} from "../types/api";
import {useNavigate} from "react-router-dom";


const HomePage: React.FC = () => {
    const [tournaments, setTournaments] = useState<ITournament[]>([]);
    const [enteredPin, setEnteredPin] = useState('');
    const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
    const [pinError, setPinError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for Modal
    const [selectedTournamentName, setSelectedTournamentName] = useState<string | null>(null); // Tournament name for modal
    const navigate = useNavigate();

    useEffect(() => {
        const getTournaments = async () => {
            const data = await fetchTournaments();
            setTournaments(data);
            console.log(data);
        };
        getTournaments().then();
    }, []);

    const handleEditClick = (tournamentId: string, tournamentName: string) => {
        setSelectedTournamentId(tournamentId);
        setSelectedTournamentName(tournamentName);
        setIsModalOpen(true); // Open the modal
        setPinError(null); // Reset PIN error on new open
    };

    const handlePinSubmit = async () => {
        if (selectedTournamentId) {
            const isValid = await validateTournamentPin(selectedTournamentId, enteredPin); // PIN validation API call
            if (isValid) {
                navigate(`/tournament/${selectedTournamentId}/edit`);
            } else {
                setPinError('Falscher PIN, bitte erneut versuchen.');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
        setEnteredPin(''); // Reset the entered PIN when closing
    };

    return <Container>
        <Grid container spacing={3}>
            {tournaments.map((tournament) => (
                 <Grid>
                    <TournamentCard name={tournament.name} createdAt={tournament.created_at}/>
                     <Button variant="contained" onClick={() =>  handleEditClick(tournament.id.toString(), tournament.name)}>
                        Turnier bearbeiten
                    </Button>
                </Grid>
            ))}
        </Grid>

        {/* Modal for PIN entry */}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
            <DialogTitle>{selectedTournamentName} bearbeiten</DialogTitle>
            <DialogContent>
                <TextField
                    label="PIN eingeben"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    fullWidth
                    margin="normal"
                    error={!!pinError} // If there is an error, mark the field as error
                    helperText={pinError} // Display error message if any
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal} color="secondary">
                    Abbrechen
                </Button>
                <Button onClick={handlePinSubmit} color="primary" variant="contained">
                    Bestätigen
                </Button>
            </DialogActions>
        </Dialog>
    </Container>;
};

export default HomePage;
