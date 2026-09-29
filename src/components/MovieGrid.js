import React from 'react';
import { Skeleton } from '@mui/material';
import MovieCard from './MovieCard';

export function MovieGrid({ movies = [], loading = false }) {
  if (loading && !movies.length) return <div className="movie-grid">{Array.from({ length: 10 }, (_, i) => <div className="skeleton-card" key={i}><Skeleton variant="rounded" className="skeleton-poster" /><Skeleton width="75%" /><Skeleton width="38%" /></div>)}</div>;
  return <div className="movie-grid">{movies.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} />)}</div>;
}

export function EmptyState({ icon = '✦', title, description, action }) {
  return <div className="empty-state"><span className="empty-icon">{icon}</span><h2>{title}</h2><p>{description}</p>{action}</div>;
}
