import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Link } from 'react-router-dom';
import { posterUrl } from '../api/tmdb';
import { useApp } from '../context/AppContext';

export default function MovieCard({ movie, index = 0 }) {
  const { favorites, toggleFavorite } = useApp();
  const saved = favorites.some((item) => item.id === movie.id);
  const title = movie.title || movie.name || 'Untitled';
  const year = (movie.release_date || '').slice(0, 4) || '—';
  const rating = Number(movie.vote_average || 0).toFixed(1);
  return (
    <article className="movie-card" style={{ '--card-index': Math.min(index, 12) }}>
      <Link to={`/movie/${movie.id}`} className="poster-link" aria-label={`View ${title}`}>
        <div className="poster-wrap">
          {movie.poster_path ? <img className="poster-image" src={posterUrl(movie.poster_path)} alt={`${title} poster`} loading="lazy" /> : <div className="poster-fallback">🎬<span>Poster unavailable</span></div>}
          <span className="poster-rating"><StarRoundedIcon />{rating}</span>
          <span className="poster-open">View film <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
      <Tooltip title={saved ? 'Remove from watchlist' : 'Add to watchlist'}>
        <IconButton className={`favorite-button ${saved ? 'is-saved' : ''}`} aria-label={`${saved ? 'Remove' : 'Add'} ${title} ${saved ? 'from' : 'to'} watchlist`} onClick={() => toggleFavorite(movie)}>
          {saved ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
        </IconButton>
      </Tooltip>
      <div className="card-copy"><h3>{title}</h3><span>{year}</span></div>
    </article>
  );
}
