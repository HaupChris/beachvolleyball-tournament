// src/components/TournamentCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface TournamentCardProps {
  name: string;
  createdAt: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ name, createdAt }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography color="text.secondary">
            {createdAt}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TournamentCard;
