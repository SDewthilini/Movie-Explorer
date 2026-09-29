import React, { useEffect, useState } from 'react';
import { Alert, Button, Chip, CircularProgress } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Link, useParams } from 'react-router-dom';
import { friendlyError, posterUrl, tmdb } from '../api/tmdb';
import { useApp } from '../context/AppContext';
import { sampleDetails } from '../data/sampleMovies';

export default function DetailsPage() {
  const { movieId } = useParams();
  const { favorites, toggleFavorite } = useApp();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    if (!process.env.REACT_APP_TMDB_API_KEY) {
      setMovie(sampleDetails(movieId)); setError(''); setLoading(false);
      return () => controller.abort();
    }
    tmdb.details(movieId, controller.signal).then(setMovie).catch((e) => { if (e.name !== 'CanceledError') setError(friendlyError(e)); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [movieId]);
  if (loading) return <main className="detail-loading"><CircularProgress /><span>Finding the story…</span></main>;
  if (error || !movie) return <main className="detail-error"><Alert severity="error">{error || 'Movie not found.'}</Alert><Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />}>Back to discovery</Button></main>;
  const saved = favorites.some((item) => item.id === movie.id);
  const trailer = movie.videos?.results?.find((video) => video.site === 'YouTube' && video.type === 'Trailer') || movie.videos?.results?.find((video) => video.site === 'YouTube');
  const year = (movie.release_date || '').slice(0, 4);
  const backdrop = posterUrl(movie.backdrop_path, 'original');
  return (
    <main className="detail-page">
      <div className="detail-backdrop" style={backdrop ? { backgroundImage: `linear-gradient(90deg, var(--page) 0%, color-mix(in srgb, var(--page) 70%, transparent) 60%, var(--page) 100%), linear-gradient(0deg, var(--page), transparent 75%), url(${backdrop})` } : undefined} />
      <div className="detail-shell">
        <Button component={Link} to="/" className="back-link" startIcon={<ArrowBackRoundedIcon />}>Back to discovery</Button>
        <div className="detail-layout">
          <div className="detail-poster">{movie.poster_path ? <img src={posterUrl(movie.poster_path, 'w780')} alt={`${movie.title} poster`} /> : <div className="poster-fallback">🎬</div>}</div>
          <div className="detail-copy">
            <span className="section-kicker">THE FEATURE PRESENTATION</span>
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">“{movie.tagline}”</p>}
            <div className="detail-meta"><span><StarRoundedIcon /> {Number(movie.vote_average || 0).toFixed(1)} <small>/ 10</small></span><i />{year && <span>{year}</span>}{movie.runtime > 0 && <><i /><span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span></>}</div>
            <div className="genre-chips">{movie.genres?.map((genre) => <Chip key={genre.id} label={genre.name} size="small" />)}</div>
            <h2 className="detail-subhead">The story</h2><p className="overview">{movie.overview || 'No synopsis is available for this film yet.'}</p>
            <div className="detail-actions"><Button variant="contained" onClick={() => toggleFavorite(movie)} startIcon={saved ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}>{saved ? 'In your watchlist' : 'Add to watchlist'}</Button>{trailer && <Button variant="outlined" href={`https://www.youtube-nocookie.com/embed/${trailer.key}`} target="_blank" rel="noreferrer" startIcon={<PlayArrowRoundedIcon />}>Watch trailer</Button>}</div>
            {movie.credits?.cast?.length > 0 && <><h2 className="detail-subhead cast-heading">The cast</h2><div className="cast-list">{movie.credits.cast.slice(0, 8).map((person) => <div className="cast-person" key={person.cast_id || person.credit_id}><span>{person.profile_path ? <img src={posterUrl(person.profile_path, 'w185')} alt="" loading="lazy" /> : <span className="cast-placeholder">{person.name?.slice(0, 1)}</span>}</span><strong>{person.name}</strong><small>{person.character}</small></div>)}</div></>}
            {movie.production_companies?.length > 0 && <p className="production-line">A film by {movie.production_companies.slice(0, 3).map((company) => company.name).join(' · ')}</p>}
          </div>
        </div>
      </div>
      <footer className="footer"><span className="brand footer-brand">CINE<span className="brand-accent">SCOPE</span></span><span>Made for the love of a good story.</span><span className="tmdb-credit"></span></footer>
    </main>
  );
}
