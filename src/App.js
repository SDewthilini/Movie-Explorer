import React, { useMemo } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import { useApp } from './context/AppContext';
import './styles.css';

export default function App() {
  const { darkMode } = useApp();
  const theme = useMemo(() => createTheme({
    palette: { mode: darkMode ? 'dark' : 'light', primary: { main: '#ab92ff' }, secondary: { main: '#dc4d75' }, background: { default: darkMode ? '#11131a' : '#f8f8fb', paper: darkMode ? '#191c25' : '#fff' } },
    typography: { fontFamily: 'Inter, "Segoe UI", sans-serif', button: { textTransform: 'none', fontWeight: 650 } },
    shape: { borderRadius: 12 },
  }), [darkMode]);
  return <ThemeProvider theme={theme}><CssBaseline /><div className={darkMode ? 'app-shell dark' : 'app-shell light'}><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/movie/:movieId" element={<DetailsPage />} /><Route path="/favorites" element={<FavoritesPage />} /><Route path="/login" element={<LoginPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></div></ThemeProvider>;
}
