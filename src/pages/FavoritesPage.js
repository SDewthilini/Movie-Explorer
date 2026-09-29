import React from 'react';
import { Button } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Link } from 'react-router-dom';
import { EmptyState, MovieGrid } from '../components/MovieGrid';
import { useApp } from '../context/AppContext';

export default function FavoritesPage() {
  const { favorites } = useApp();
  return <main className="page-container favorites-page"><section className="section"><div className="section-heading"><div><span className="section-kicker">YOUR PERSONAL COLLECTION</span><h1 className="page-title">The <em>watchlist</em></h1></div><span className="results-count">{favorites.length} FILMS SAVED</span></div>{favorites.length ? <MovieGrid movies={favorites} /> : <EmptyState icon="♡" title="Your watchlist is waiting" description="Save the films that catch your eye, and they’ll be right here when movie night rolls around." action={<Button component={Link} to="/" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>Find your next film</Button>} />}</section><footer className="footer"><span className="brand footer-brand">CINE<span className="brand-accent">SCOPE</span></span><span>Made for the love of a good story.</span><span className="tmdb-credit"></span></footer></main>;
}
