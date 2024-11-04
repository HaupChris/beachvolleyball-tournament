import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import TournamentCard from '../components/TournamentCard';
import { deleteTournament, fetchTournaments, validateTournamentPin } from '../services/api';
import { ITournament } from "../types/api";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const [tournaments, setTournaments] = useState<ITournament[]>([]);
    const [enteredPin, setEnteredPin] = useState('');
    const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
    const [selectedAction, setSelectedAction] = useState<'start' | 'edit' | 'delete' | null>(null);
    const [pinError, setPinError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTournamentName, setSelectedTournamentName] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getTournaments = async () => {
            const data = await fetchTournaments();
            setTournaments(data);
            console.log(data);
        };
        getTournaments().then();
    }, []);

    const openPinModal = (tournamentId: number, tournamentName: string, action: 'start' | 'edit' | 'delete') => {
        setSelectedTournamentId(tournamentId);
        setSelectedTournamentName(tournamentName);
        setSelectedAction(action);
        setIsModalOpen(true);
        setPinError(null);
    };

    const handlePinSubmit = async () => {
        if (selectedTournamentId && selectedAction) {
            const isValid = await validateTournamentPin(selectedTournamentId, enteredPin);
            if (isValid) {
                switch (selectedAction) {
                    case 'start':
                        // Handle start action
                        console.log("Tournament started");
                        break;
                    case 'edit':
                        navigate(`/tournament/${selectedTournamentId}/edit`);
                        break;
                    case 'delete':
                        await deleteTournament(selectedTournamentId);
                        setTournaments(tournaments.filter(t => t.id !== selectedTournamentId));
                        break;
                }
                handleCloseModal();
            } else {
                setPinError('Falscher PIN, bitte erneut versuchen.');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEnteredPin('');
    };

    return (
        <Container>
            <Grid container spacing={3}>
                {tournaments.map((tournament) => (
                    <Grid>
                        <TournamentCard
                            name={tournament.name}
                            createdAt={tournament.created_at}
                            onStartClick={() => openPinModal(tournament.id, tournament.name, 'start')}
                            onEditClick={() => openPinModal(tournament.id, tournament.name, 'edit')}
                            onWatchClick={() => navigate(`/tournament/${tournament.id}`)}
                            onDeleteClick={() => openPinModal(tournament.id, tournament.name, 'delete')}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Modal for PIN entry */}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>{selectedTournamentName} {selectedAction === 'edit' ? 'bearbeiten' : selectedAction === 'delete' ? 'löschen' : 'starten'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="PIN eingeben"
                        value={enteredPin}
                        onChange={(e) => setEnteredPin(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!pinError}
                        helperText={pinError}
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
        </Container>
    );
};

export default HomePage;
