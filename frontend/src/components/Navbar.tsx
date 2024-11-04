import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    ListItemButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import HistoryIcon from '@mui/icons-material/History';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <List>
      <ListItemButton component={Link} to="/" onClick={toggleDrawer(false)}>
        <ListItemIcon><SportsVolleyballIcon /></ListItemIcon>
        <ListItemText primary="Aktuelle Turniere" />
      </ListItemButton>
      <ListItemButton component={Link} to="/tournaments" onClick={toggleDrawer(false)}>
        <ListItemIcon><HistoryIcon /></ListItemIcon>
        <ListItemText primary="Vergangene Turniere" />
      </ListItemButton>
      <ListItemButton component={Link} to="/create-tournament" onClick={toggleDrawer(false)}>
        <ListItemIcon><AddCircleIcon /></ListItemIcon>
        <ListItemText primary="Turnier erstellen" />
      </ListItemButton>
    </List>
  );

  return (
    <AppBar position="static" style={{ marginBottom: "2em" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          BeachL Turnier App
        </Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/">
              <SportsVolleyballIcon sx={{ mr: 1 }} />
              Aktuelle Turniere
            </Button>
            <Button color="inherit" component={Link} to="/tournaments">
              <HistoryIcon sx={{ mr: 1 }} />
              Vergangene Turniere
            </Button>
            <Button color="inherit" component={Link} to="/create-tournament">
              <AddCircleIcon sx={{ mr: 1 }} />
              Turnier erstellen
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
