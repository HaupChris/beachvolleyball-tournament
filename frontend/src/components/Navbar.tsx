// src/components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {Link} from "react-router-dom";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Beachvolleyball Turnier
        </Typography>
        {isMobile ? (
          <Button color="inherit">Menu</Button> // Hier könnte später ein Drawer integriert werden
        ) : (
          <>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/tournaments">Turniere</Button>
            <Button color="inherit" component={Link} to="/create-tournament">
              Turnier erstellen
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
