import React, {useState} from 'react';
import {
    Container,
    Button,
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogContent,
    DialogActions, Alert
} from '@mui/material';
import {createDummyTournament, createTournament} from '../services/api';
import {useNavigate} from "react-router-dom";
import {TournamentDetails} from "../components/TournamentDetails";
import {ICourt, ITeam, ITournament} from "../types/api";
import {TournamentTeams} from "../components/TournamentTeams";
import {TournamentCourts} from "../components/TournamentCourts";
import {CheckCircle} from "@mui/icons-material";

export function updateTournamentAttributes(
    tournament: ITournament,
    updates: Partial<Omit<ITournament, 'courts' | 'teams' | 'matches'>>
): ITournament {
    return {
        ...tournament,
        ...updates,
    };
}

const CreateTournamentPage: React.FC = () => {
    const [tournament, setTournament] = useState(createDummyTournament());
    const [error, setError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(0); // Stepper state
    const [openModal, setOpenModal] = useState(false); // Modal state

    const navigate = useNavigate();

    const handleAttributeChange = (attribute: keyof Omit<ITournament, 'courts' | 'teams' | 'matches'>, value: any) => {
        if (tournament) {
            setTournament(updateTournamentAttributes(tournament, {[attribute]: value}));
        }
    };

    const canProceedToNextStep = () => {
        // Reset error messages
        setError(null);

        if (activeStep === 0) {
            // Step 1: Check that there are teams and courts selected
            if (tournament.teams.length <= 1) {
                setError("Anzahl der Teams muss mehr als 1 sein!");
                return false;
            }
            if (tournament.courts.length <= 0) {
                setError("Anzahl der Felder muss mindestens 1 sein!");
                return false;
            }
        } else if (activeStep === 1) {
            // Step 2: Check that every team has players added
            for (const team of tournament.teams) {
                if (!team.players || team.players.length === 0) {
                    setError(`Bitte füge ${tournament.players_per_team} Spieler*innen jedem Team hinzu!`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleNext = () => {
        if (canProceedToNextStep()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const updateNumberOfTournamentCourts = (newAmount: number) => {
        setTournament((prevTournament) => {
            const courts = [...prevTournament.courts]; // Copy the existing courts array

            if (courts.length >= newAmount) {
                return {
                    ...prevTournament,
                    courts: courts.slice(0, newAmount), // Slice the array immutably
                };
            } else {
                const missingCourtNumbers = Array.from({length: newAmount - courts.length}, (_, i) => courts.length + i + 1);
                const newCourts = missingCourtNumbers.map((number) => ({
                    name: `Feld ${number}`,
                } as ICourt));

                return {
                    ...prevTournament,
                    courts: [...courts, ...newCourts], // Add the new courts immutably
                };
            }
        });
    };

    const updateNumberOfTournamentTeams = (newAmount: number) => {
        setTournament((prevTournament) => {
            const teams = [...prevTournament.teams]; // Copy the existing teams array

            if (teams.length >= newAmount) {
                return {
                    ...prevTournament,
                    teams: teams.slice(0, newAmount), // Slice the array immutably
                };
            } else {
                const missingTeamNumbers = Array.from({length: newAmount - teams.length}, (_, i) => teams.length + i + 1);
                const newTeams = missingTeamNumbers.map((number) => ({
                    id: number,
                    tournament: prevTournament.id,
                    players: [],
                } as ITeam));

                return {
                    ...prevTournament,
                    teams: [...teams, ...newTeams], // Add the new teams immutably
                };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error on form submit
        try {
            const createdTournament = await createTournament(tournament);
            setTournament(createdTournament);
            // Open the modal to show the PIN
            setOpenModal(true);
        } catch (err) {
            setError('Fehler beim Erstellen des Turniers!');
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate(`/tournament/${tournament.id}/edit`); // Navigate after closing modal
    };

    const steps = ['Details', 'Teams', 'Feldernamen'];

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <TournamentDetails tournament={tournament}
                                          updateTournamentDetail={handleAttributeChange}
                                          updateNumberOfCourts={updateNumberOfTournamentCourts}
                                          updateNumberOfTeams={updateNumberOfTournamentTeams}/>;
            case 1:
                return <TournamentTeams tournament={tournament}
                                        updateTeams={(teams) => setTournament({...tournament, teams})}/>;
            case 2:
                return <TournamentCourts tournament={tournament}
                                         updateCourts={(courts) => setTournament({...tournament, courts})}/>;
            default:
                return null;
        }
    };

    return (
        <Container>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>


            <Box mt={4}>
                {renderStepContent(activeStep)}
                <Box mt={2}>
                    {activeStep > 0 && (
                        <Button variant="outlined" onClick={handleBack} sx={{mr: 2}}>
                            Zurück
                        </Button>
                    )}

                    {/* Show error message if the tournament creation failed */}
                    {error &&
                        <Alert severity="error"
                               variant={"outlined"}
                               sx={{marginY: "1em"}}
                               onClose={() => {
                                   setError(null)
                               }}>
                            {error}
                        </Alert>
                    }

                    {activeStep === steps.length - 1 ? (
                        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                            Turnier erstellen
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            Weiter
                        </Button>
                    )}

                </Box>
            </Box>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogContent sx={{textAlign: 'center', p: 4}}>
                    <CheckCircle sx={{fontSize: 80, color: 'green'}}/>
                    <Typography variant="h5" color="green" sx={{mt: 2}}>
                        <strong>{tournament.name}</strong> wurde erfolgreich erstellt.
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{mt: 2}}>
                        Dein Ausrichter-PIN lautet: <strong>{tournament.password}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{mt: 2}}>
                        Bitte notiere dir den PIN, da er für spätere Bearbeitungen und zum Starten des Turniers benötigt
                        wird.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'center', mb: 2}}>
                    <Button onClick={handleCloseModal} color="primary" variant="contained">
                        Verstanden
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
        ;
};

export default CreateTournamentPage;
