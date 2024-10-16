// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Container } from '@mui/material';
import TournamentCard from '../components/TournamentCard';
import { fetchTournaments } from '../services/api';
import {ITournament} from "../types/api";

const HomePage: React.FC = () => {
  const [tournaments, setTournaments] = useState<ITournament[]>([]);

  useEffect(() => {
    const getTournaments = async () => {
      const data = await fetchTournaments();
      setTournaments(data);
    };
    getTournaments();
  }, []);

  return (
    <Container>
      <Grid container spacing={3}>
        {tournaments.map((tournament: { id: number; name: string; created_at: string }) => (
          <TournamentCard key={tournament.id} name={tournament.name} createdAt={tournament.created_at} />
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
