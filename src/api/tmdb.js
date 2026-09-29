import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 12000,
  params: API_KEY ? { api_key: API_KEY } : {},
});

export const IMAGE_BASE = 'https://image.tmdb.org/t/p/';
export const posterUrl = (path, size = 'w500') => path ? `${IMAGE_BASE}${size}${path}` : '';
export const hasApiKey = Boolean(API_KEY);

export function friendlyError(error) {
  if (!error?.response) return 'Could not reach TMDb. Check your connection and try again.';
  if (error.response.status === 401) return 'TMDb authorization failed. Check your API key in .env.local.';
  if (error.response.status === 404) return 'We could not find that movie.';
  if (error.response.status === 429) return 'Too many requests. Give it a moment, then try again.';
  return 'Movie data is temporarily unavailable. Please try again.';
}

export const tmdb = {
  trending: (signal) => client.get('/trending/movie/week', { signal }).then((r) => r.data),
  popular: (signal) => client.get('/movie/popular', { signal }).then((r) => r.data),
  search: (query, page, signal) => client.get('/search/movie', {
    params: { query, page, include_adult: false }, signal,
  }).then((r) => r.data),
  discover: (filters, page, signal) => client.get('/discover/movie', {
    params: { sort_by: 'popularity.desc', include_adult: false, ...filters, page }, signal,
  }).then((r) => r.data),
  genres: (signal) => client.get('/genre/movie/list', { signal }).then((r) => r.data.genres),
  details: (id, signal) => client.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos' }, signal }).then((r) => r.data),
};
