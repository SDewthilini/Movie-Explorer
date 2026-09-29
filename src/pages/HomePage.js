import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MovieCard from '../components/MovieCard';
import { EmptyState, MovieGrid } from '../components/MovieGrid';
import Notice from '../components/Notice';
import SearchFilters from '../components/SearchFilters';
import { useDebounce } from '../hooks/useDebounce';
import { friendlyError, hasApiKey, posterUrl, tmdb } from '../api/tmdb';
import { useApp } from '../context/AppContext';
import { sampleMovies } from '../data/sampleMovies';

const initialFilters = { genre: '', year: '', rating: 0 };

export default function HomePage() {
  const { query, updateQuery } = useApp();
  const [input, setInput] = useState(query);
  const debounced = useDebounce(input, 400);
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [trendError, setTrendError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const genreMap = useMemo(() => Object.fromEntries(genres.map((genre) => [genre.id, genre.name])), [genres]);

  useEffect(() => {
    if (!hasApiKey) {
      if (!debounced.trim()) updateQuery('');
      setTrending(sampleMovies);
      setMovies(sampleMovies);
      setSearchMode(Boolean(debounced.trim()));
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    tmdb.genres(controller.signal).then(setGenres).catch(() => {});
    tmdb.trending(controller.signal).then((data) => setTrending(data.results || [])).catch((error) => setTrendError(friendlyError(error)));
    return () => controller.abort();
  }, [debounced, updateQuery]);

  useEffect(() => {
    if (!hasApiKey) return undefined;
    if (!debounced.trim()) {
      setSearchMode(false); setMovies([]); setSearchError(''); updateQuery(''); return undefined;
    }
    setSearchMode(true); updateQuery(debounced.trim()); setLoading(true); setSearchError('');
    const controller = new AbortController();
    const run = async () => {
      try {
        const base = filters.genre || filters.year || Number(filters.rating) > 0;
        const data = base
          ? await tmdb.discover({ ...(filters.genre ? { with_genres: filters.genre } : {}), ...(filters.year ? { primary_release_year: filters.year } : {}), ...(Number(filters.rating) ? { 'vote_average.gte': filters.rating } : {}) }, 1, controller.signal)
          : await tmdb.search(debounced.trim(), 1, controller.signal);
        const results = data.results || [];
        setMovies(results); setPage(1); setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (error) { if (error.name !== 'CanceledError' && error.name !== 'AbortError') setSearchError(friendlyError(error)); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    run();
    return () => controller.abort();
  }, [debounced, filters, updateQuery]);

  useEffect(() => {
    if (hasApiKey) return;
    const normalized = debounced.trim().toLowerCase();
    const selected = normalized ? sampleMovies.filter((movie) => movie.title.toLowerCase().includes(normalized)) : sampleMovies;
    setSearchMode(Boolean(normalized));
    setMovies(selected);
    setPage(1);
    setTotalPages(1);
    setSearchError('');
  }, [debounced]);

  const loadMore = async () => {
    if (loading || page >= totalPages) return;
    setLoading(true); setSearchError('');
    try {
      const nextPage = page + 1;
      const base = filters.genre || filters.year || Number(filters.rating) > 0;
      const data = base
        ? await tmdb.discover({ ...(filters.genre ? { with_genres: filters.genre } : {}), ...(filters.year ? { primary_release_year: filters.year } : {}), ...(Number(filters.rating) ? { 'vote_average.gte': filters.rating } : {}) }, nextPage)
        : await tmdb.search(debounced.trim(), nextPage);
      setMovies((current) => [...current, ...(data.results || [])]); setPage(nextPage);
    } catch (error) { setSearchError(friendlyError(error)); }
    finally { setLoading(false); }
  };

  const hero = trending[0];
  const heroBackdrop = hero?.backdrop_path ? posterUrl(hero.backdrop_path, 'original') : '';
  return (
    <main>
      <section className="hero" style={heroBackdrop ? { '--hero-image': `url(${heroBackdrop})` } : undefined}>
        <div className="hero-content">
          <div className="eyebrow"><span className="live-dot" /> YOUR NEXT FAVORITE FILM IS HERE</div>
          <h1>Stories worth<br /><span>staying in for.</span></h1>
          <p>Find the film you didn’t know you were looking for.</p>
          <form className="hero-search" onSubmit={(e) => { e.preventDefault(); document.getElementById('movie-search')?.focus(); }}>
            <TextField id="movie-search" fullWidth value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search movies, genres, moods..." inputProps={{ 'aria-label': 'Search movies' }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>, endAdornment: input && <InputAdornment position="end"><IconButton aria-label="Clear search" onClick={() => setInput('')}><CloseRoundedIcon /></IconButton></InputAdornment> }} />
            <Button className="search-submit" variant="contained" type="submit" aria-label="Search">Explore</Button>
          </form>
          <div className="search-hint">TRENDING SEARCHES <button type="button" onClick={() => setInput('Dune')}>Dune</button><button type="button" onClick={() => setInput('Interstellar')}>Interstellar</button><button type="button" onClick={() => setInput('Poor Things')}>Poor Things</button></div>
        </div>
        <div className="hero-index"><span>01</span><i /> <span>DISCOVER</span></div>
        <div className="hero-scroll">SCROLL TO EXPLORE <span>↓</span></div>
      </section>

      {!hasApiKey && <div className="setup-banner"><Alert severity="info"><strong>One quick setup:</strong> add your TMDb key to <code>.env.local</code> as <code>REACT_APP_TMDB_API_KEY=your_key</code>, then restart <code>npm start</code>. The app is ready; live movie data needs your key.</Alert></div>}
      <div className="page-container">
        {searchMode ? (
          <section className="section search-results-section" aria-labelledby="results-heading">
            <div className="section-heading"><div><span className="section-kicker">THE COLLECTION</span><h2 id="results-heading">Results for <em>“{debounced}”</em></h2></div><span className="results-count">{movies.length} FILMS</span></div>
            <SearchFilters filters={filters} setFilters={setFilters} genres={genres} />
            {searchError && <Notice onRetry={() => setInput((v) => `${v} `)}>{searchError}</Notice>}
            {!loading && !searchError && movies.length === 0 ? <EmptyState icon="⌕" title="No films found" description="Try another title or adjust your filters. The perfect story is out there." /> : <MovieGrid movies={movies} loading={loading} />}
            {movies.length > 0 && page < totalPages && <div className="load-more-wrap"><Button onClick={loadMore} disabled={loading} endIcon={<ArrowForwardRoundedIcon />} className="load-more">{loading ? 'Loading…' : 'Load more films'}</Button><span>PAGE {page} OF {totalPages}</span></div>}
          </section>
        ) : <>
          <section className="section trending-section" aria-labelledby="trending-heading">
            <div className="section-heading"><div><span className="section-kicker">WHAT EVERYONE’S WATCHING</span><h2 id="trending-heading">Trending <em>this week</em></h2></div><span className="section-side-note"><span className="live-dot" /> UPDATED DAILY</span></div>
            {trendError && <Notice>{trendError}</Notice>}
            <div className="trending-row">{trending.slice(0, 5).map((movie, index) => <div className="trending-item" key={movie.id}><span className="trend-number">0{index + 1}</span><MovieCard movie={movie} index={index} /></div>)}</div>
          </section>
          <section className="section popular-section" aria-labelledby="popular-heading">
            <div className="section-heading"><div><span className="section-kicker">HANDPICKED FOR YOUR NEXT NIGHT IN</span><h2 id="popular-heading">Popular <em>right now</em></h2></div><span className="section-side-note">THE CROWD PLEASERS</span></div>
            <div className="popular-grid">{trending.slice(5, 13).map((movie, index) => <MovieCard movie={movie} index={index} key={movie.id} />)}</div>
          </section>
        </>}
      </div>
      <footer className="footer"><span className="brand footer-brand">CINE<span className="brand-accent">SCOPE</span></span><span>Made for the love of a good story.</span><span className="tmdb-credit"></span></footer>
    </main>
  );
}
