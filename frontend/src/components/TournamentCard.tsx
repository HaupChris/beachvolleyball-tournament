// src/components/TournamentCard.tsx
import React from 'react';
import {Card, CardActions, CardContent, IconButton, Typography} from '@mui/material';
import {Delete, Edit, PlayCircle, Visibility} from "@mui/icons-material";

interface TournamentCardProps {
    name: string;
    createdAt: string;
    onStartClick: () => void;
    onEditClick: () => void;
    onWatchClick: () => void;
    onDeleteClick:() => void;
}

function TournamentCard(props: TournamentCardProps){
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {props.name}
                </Typography>
                <Typography color="text.secondary">
                    {props.createdAt}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton onClick={props.onStartClick} aria-label="add to favorites">
                    <PlayCircle/>
                </IconButton>
                <IconButton onClick={props.onWatchClick} aria-label="add to favorites">
                    <Visibility/>
                </IconButton>
                <IconButton onClick={props.onEditClick} aria-label="add to favorites">
                    <Edit/>
                </IconButton>
                <IconButton onClick={props.onDeleteClick} aria-label="add to favorites">
                    <Delete/>
                </IconButton>

            </CardActions>
        </Card>
    );
};

export default TournamentCard;
