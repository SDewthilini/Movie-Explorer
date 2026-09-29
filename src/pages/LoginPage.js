import React, { useState } from 'react';
import { Alert, Button, TextField } from '@mui/material';
import LocalMoviesRoundedIcon from '@mui/icons-material/LocalMoviesRounded';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { user, login } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  if (user) return <Navigate to="/" replace />;
  const submit = (event) => {
    event.preventDefault();
    if (name.trim().length < 2) return setError('Please enter a name with at least 2 characters.');
    if (password.length < 4) return setError('Please enter a password with at least 4 characters.');
    login(name.trim()); navigate('/');
  };
  return <main className="login-page"><div className="login-card"><Link to="/" className="brand login-brand"><span className="brand-mark"><LocalMoviesRoundedIcon /></span><span>CINE<span className="brand-accent">SCOPE</span></span></Link><span className="section-kicker">YOUR SEAT IS WAITING</span><h1>Welcome <em>back.</em></h1><p className="login-intro">Sign in and pick up where your next great story begins.</p><Alert severity="info" className="demo-note">Demo sign-in only. Your password is never saved; this does not create a secure account.</Alert><form onSubmit={submit} className="login-form">{error && <Alert severity="error">{error}</Alert>}<TextField label="Your name" autoComplete="username" value={name} onChange={(e) => setName(e.target.value)} required fullWidth /><TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth /><Button variant="contained" type="submit" size="large">Come on in <span aria-hidden="true">→</span></Button></form><Link to="/" className="login-back">← &nbsp;Back to exploring</Link></div></main>;
}
