import React, {useState} from 'react';
import {Container, Button, Box, Typography, Stepper, Step, StepLabel} from '@mui/material';
import {createDummyTournament, createTournament} from '../services/api';
import {useNavigate} from "react-router-dom";
import {TournamentDetails} from "../components/TournamentDetails";
import {ITournament} from "../types/api";
import {TournamentTeams} from "../components/TournamentTeams";
import {TournamentCourts} from "../components/TournamentCourts";

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
    const [generatedPin, setGeneratedPin] = useState<string | null>(null);  // For storing the PIN
    const [error, setError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(0); // Stepper state
    const navigate = useNavigate();

    const handleAttributeChange = (attribute: keyof Omit<ITournament, 'courts' | 'teams' | 'matches'>, value: any) => {
        if (tournament) {
            setTournament(updateTournamentAttributes(tournament, {[attribute]: value}));
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error on form submit
        setGeneratedPin(null); // Reset PIN on form submit
        try {
            const createdTournament = await createTournament(tournament);
            // Store the generated PIN
            setGeneratedPin(createdTournament.password);
            navigate(`/tournament/${createdTournament.id}/edit`);
        } catch (err) {
            setError('Failed to create tournament');
        }
    };

    const steps = ['Details', 'Teams', 'Feldernamen'];

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <TournamentDetails tournament={tournament}
                                          updateTournamentDetail={handleAttributeChange}/>;
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
