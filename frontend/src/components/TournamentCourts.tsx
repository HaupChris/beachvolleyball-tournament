import React, {useEffect} from 'react';
import {TextField, List, ListItem, ListItemText, IconButton, Typography, Box} from '@mui/material';
import {ICourt, ITournament} from "../types/api";
import EditIcon from '@mui/icons-material/Edit';

interface IProps {
    tournament: ITournament;
    updateCourts: (courts: ICourt[]) => void;
}

export function TournamentCourts({tournament, updateCourts}: IProps) {
    const [editIndex, setEditIndex] = React.useState<number | null>(null);

    useEffect(() => {
        if (tournament.courts.length < tournament.number_of_courts) {
            console.log("useeffect courtnames not enough")
            const m = tournament.courts.length;
            const n = tournament.number_of_courts;
            const missingCourtNumbers = Array.from(Array(n-m).keys()).map(num => num + 1 + m)
            const newCourts: ICourt[] = missingCourtNumbers.map((number) => {
                    return {name: `Feld ${number}`}
                }
            )
            console.log(newCourts, m, n, missingCourtNumbers, newCourts)
            updateCourts(tournament.courts.concat(newCourts));
        } else{
            if (tournament.courts.length > tournament.number_of_courts) {
                const updatedCourts = tournament.courts.slice(0, tournament.number_of_courts);
                updateCourts(updatedCourts);
            }
        }
    }, [])

    const handleEditClick = (index: number) => {
        setEditIndex(index);
    };

    const handleNameChange = (index: number, newName: string) => {
        const updatedCourts = tournament.courts;
        updatedCourts[index].name = newName;
        updateCourts(updatedCourts);
    };

    const handleBlur = () => {
        setEditIndex(null);
    };

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                Felder
            </Typography>
            <List>
                {tournament.courts.map((court, index) => (
                    <ListItem key={index} divider>
                        {editIndex === index ? (
                            <TextField
                                value={court.name}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                onBlur={handleBlur}
                                autoFocus
                                fullWidth
                            />
                        ) : (
                            <>
                                <ListItemText primary={court.name || `Court ${index + 1}`} />
                                <IconButton edge="end" onClick={() => handleEditClick(index)}>
                                    <EditIcon />
                                </IconButton>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
