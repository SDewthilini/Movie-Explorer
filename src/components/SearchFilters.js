import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Slider, Stack, TextField, Typography } from '@mui/material';

export default function SearchFilters({ filters, setFilters, genres = [] }) {
  return (
    <Stack className="filters" direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
      <FormControl size="small" className="filter-genre"><InputLabel id="genre-label">Genre</InputLabel><Select labelId="genre-label" label="Genre" value={filters.genre} onChange={(e) => setFilters((f) => ({ ...f, genre: e.target.value }))}><MenuItem value="">All genres</MenuItem>{genres.map((genre) => <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>)}</Select></FormControl>
      <TextField size="small" type="number" label="Year" value={filters.year} inputProps={{ min: 1900, max: new Date().getFullYear() + 5 }} onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))} className="filter-year" />
      <div className="rating-filter"><Typography variant="caption">Minimum rating <strong>{filters.rating}+</strong></Typography><Slider aria-label="Minimum rating" size="small" value={Number(filters.rating)} min={0} max={9} step={0.5} onChange={(_, value) => setFilters((f) => ({ ...f, rating: value }))} /></div>
    </Stack>
  );
}
