// src/App.tsx
import React from 'react';
import {ThemeProvider} from '@mui/material/styles';
import theme from './theme';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateTournamentPage from "./pages/CreateTournamentPage";
import TournamentDetailPage from "./pages/TournamentDetailPage";
import Navbar from "./components/Navbar";

function App() {
    return (
        <ThemeProvider theme={theme}>

            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/create-tournament" element={<CreateTournamentPage/>}/>
                    <Route path="/tournament/:id" element={<TournamentDetailPage/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
