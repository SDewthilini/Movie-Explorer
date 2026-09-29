import React from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import LocalMoviesRoundedIcon from '@mui/icons-material/LocalMoviesRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { darkMode, toggleTheme, favorites, user, logout } = useApp();
  const navigate = useNavigate();
  return (
    <AppBar position="sticky" elevation={0} className="topbar">
      <Toolbar className="toolbar">
        <Link to="/" className="brand"><span className="brand-mark"><LocalMoviesRoundedIcon /></span><span>CINE<span className="brand-accent">SCOPE</span></span></Link>
        <Box className="nav-links">
          <Button component={Link} to="/" color="inherit">Discover</Button>
          <Button component={Link} to="/favorites" color="inherit" startIcon={<FavoriteRoundedIcon />} className="favorites-nav">Watchlist <span className="count-pill">{favorites.length}</span></Button>
        </Box>
        <Box className="toolbar-actions">
          <IconButton aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`} onClick={toggleTheme} color="inherit">{darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}</IconButton>
          {user ? <Button color="inherit" className="profile-button" onClick={() => { logout(); navigate('/'); }} startIcon={<AccountCircleRoundedIcon />}>{user.name}</Button> : <Button color="inherit" className="profile-button" onClick={() => navigate('/login')}><AccountCircleRoundedIcon /></Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
