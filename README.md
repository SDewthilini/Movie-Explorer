# CineScope — Movie Explorer

> Discover your next favorite film. A responsive React app for exploring TMDb trends, searching titles, filtering results, watching trailers, and keeping a personal watchlist.

![Status](https://img.shields.io/badge/status-in%20development-7c3aed)
![React](https://img.shields.io/badge/React-Create%20React%20App-149eca)
![Data](https://img.shields.io/badge/data-TMDb-01b4e4)

**Live demo:** https://movie-explorer-chi-umber.vercel.app/


## Product vision

Build a polished, mobile-first movie discovery experience with a cinematic hero, curated trending row, fast search, rich film pages, and a locally saved watchlist. Keep the interface accessible, responsive, and useful in light and dark themes.

## Feature checklist

- [ ] Login screen with username/password fields and client-side validation. This is a demo-only sign-in unless a real authentication service is deliberately added; never represent localStorage credentials as secure authentication.
- [ ] Trending movies from TMDb.
- [ ] Debounced movie search, paginated results, and a **Load more** control (the spec allows this instead of automatic infinite scrolling).
- [ ] Responsive poster cards with title, year, rating, loading skeletons, image fallbacks, favorite action, and details navigation.
- [ ] Film details: overview, genres, release date, runtime, production companies, cast, rating, and YouTube trailer when available.
- [ ] Search filters: genre, release year, and minimum rating.
- [ ] Favorites/watchlist persisted in localStorage and synchronized across cards and detail views.
- [ ] Persist the most recent non-empty search query.
- [ ] Light/dark theme; use system preference initially and persist the user's choice.
- [ ] Friendly loading, empty, offline, rate-limit, and general API error states.
- [ ] Responsive React Router pages: Home, Movie Details, Favorites, Login, and not-found.
- [ ] Accessibility: keyboard operation, visible focus, semantic headings, labeled controls, and ARIA labels for icon-only buttons.
- [ ] Optional polish: recently viewed, shareable detail URLs, keyboard shortcuts, toast feedback, and back-to-top.

## Stack

- React with Create React App, as required by the brief
- React Router
- Material UI (`@mui/material`, `@mui/icons-material`, Emotion)
- Axios
- React Context for movies, favorites, and theme (Redux Toolkit is an alternative)
- TMDb API
- GitLab and Vercel or Netlify

## Step-by-step build plan

### 1. Prepare accounts and tools

Install a current Node.js LTS release and Git. Create a TMDb account, request an API key/read access token, and make a GitLab project. Choose either Vercel or Netlify for deployment. Never commit credentials.

### 2. Scaffold the app

```bash
npx create-react-app movie-explorer
cd movie-explorer
npm install axios react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled
npm start
```

Create React App is retained to satisfy the assignment. It is no longer the default recommendation for new React apps, so record this as a brief-driven choice; Vite is a reasonable alternative only if the evaluator permits it. This repository already contains the CRA scaffold and app source, so from the repository root run `npm install` then `npm start` rather than scaffolding a second copy.

Without a key, the app shows a small local sample catalogue so you can explore the layout, search sample titles, open sample detail pages, switch themes, and save favorites. Sample data is only a preview; it is not live TMDb data.

### 3. Configure the TMDb key

Create `.env.local` in the project root:

```dotenv
REACT_APP_TMDB_API_KEY=your_tmdb_v3_api_key
```

Add `.env.local` to `.gitignore`; do not paste a real key into README, screenshots, commits, or chat. CRA embeds `REACT_APP_` variables into browser code, so this protects against accidental commits but does **not** make a client-side key secret. For a public production deployment, prefer a small serverless proxy that keeps the key server-side, or follow TMDb's current guidance for a read access token and appropriate client-side use. Configure whichever approach you use in the hosting provider's environment-variable settings, then rebuild/redeploy.

### 4. Create a feature-based source tree

```text
src/
  api/              tmdbClient.js, moviesApi.js, error mapping
  app/              App.js, routes, providers
  components/       MovieCard, MovieGrid, SearchBar, FilterPanel, Header
                    TrendingSection, ThemeToggle, LoadingState, ErrorState
  context/          MovieContext, FavoritesContext, ThemeContext, AuthContext
  hooks/            useDebounce, useLocalStorage, useMovies
  pages/            HomePage, MovieDetailsPage, FavoritesPage, LoginPage, NotFoundPage
  theme/            lightTheme.js, darkTheme.js
  utils/            formatters, storage keys, image URLs
  index.js
```

### 5. Build the shared API client

Use one Axios instance, configure the TMDb base URL and credentials once, and map API errors into helpful messages. Keep endpoint functions in a separate module. Do not put request logic directly in visual components.

```js
// src/api/tmdbClient.js
import axios from 'axios';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

export const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  params: { api_key: apiKey },
});

export function getApiErrorMessage(error) {
  if (!error.response) return 'Could not reach TMDb. Check your connection and try again.';
  if (error.response.status === 401) return 'TMDb authorization failed. Check the API configuration.';
  if (error.response.status === 404) return 'That movie could not be found.';
  if (error.response.status === 429) return 'Too many requests. Please wait a moment and try again.';
  return 'Movie data is temporarily unavailable. Please try again.';
}
```

Create functions for trending, search, movie details, credits, videos, and genre list. Relevant TMDb v3 paths include `/trending/movie/week`, `/search/movie`, `/movie/{movie_id}`, `/movie/{movie_id}/credits`, `/movie/{movie_id}/videos`, `/genre/movie/list`, and `/discover/movie`. Request independent detail resources together with `Promise.all` where useful. Cancel stale search requests with `AbortController`/Axios signal.

### 6. Add routing and shared state

Set up routes for `/`, `/login`, `/favorites`, and `/movie/:movieId`; add a not-found route. Keep search results, query, filters, current page, loading, and error in a movie context or a dedicated hook. Use a single favorites source of truth so the heart state agrees everywhere. Persist favorites, theme preference, and last query with defensive JSON parsing and a `try/catch` around localStorage access.

### 7. Design the responsive interface

Start with small screens. Use MUI's `ThemeProvider`, `CssBaseline`, responsive Grid/Stack, consistent typography, comfortable poster ratios, visible focus states, and useful alt text. Add a cinematic hero treatment, curated trending carousel, skeleton cards, image fallbacks, subtle hover motion, and toast feedback. Respect `prefers-reduced-motion`. Avoid relying on color alone to communicate state.

### 8. Implement search, filters, and pagination

Make the search field controlled and debounce it by about 400 ms. Save the last non-empty query. Reset results to page 1 when query or filters change; append the next page for **Load more**. Prevent duplicate calls while loading and stop at the API-reported final page. Filter by genre/year/rating through TMDb discovery/search parameters where supported; otherwise clearly apply compatible client-side filters to loaded results. Include empty state, retry action, loading indicator, and accessible filter labels.

### 9. Implement detail and trailer views

Fetch details, credits, and videos for the route ID. Render synopsis, genres, score, release date, runtime, production, and a concise cast row. Select a YouTube trailer from returned video results and embed with a privacy-enhanced YouTube URL when possible; otherwise show a safe external watch link or a clear unavailable state. Do not call the YouTube API unless you actually need its extra data.

### 10. Add login and define its limits

The assignment asks for a login interface, not a backend. Build a validated demo form and explain that it is not real account security. Do not store passwords in localStorage. If real accounts are required, integrate a proper authentication provider and protect server-side resources; TMDb user authentication is separate from an app login.

### 11. Verify the experience

Check the supplied feature list on phone, tablet, and desktop sizes. Manually confirm keyboard navigation, empty/no-image cases, theme persistence, favorites after refresh, query restoration, route refresh, failed/offline requests, 401, 404, and 429 messaging. Check that the API key is absent from Git history and public documentation. Add automated tests if the course requires them; otherwise prioritize focused manual acceptance checks.

### 12. Write the README, publish, and deliver

Capture light and dark screenshots plus a short search/trailer GIF. Add setup, environment-variable instructions, architecture, features, known demo-login limits, attribution, repository URL, and live URL here. Push to GitLab. Import the repository into Vercel/Netlify, set production environment variables, configure SPA fallback rewrites so deep movie URLs load, deploy, and verify a direct refresh on a movie route. Add the live demo URL above.

## TMDb API and attribution

Use the official [TMDb API documentation](https://developer.themoviedb.org/docs) for current authentication, endpoints, image configuration, rate limits, and required branding/attribution. Review [TMDb terms](https://www.themoviedb.org/terms-of-use) before public release. Display the attribution and non-endorsement notice required by TMDb's current brand/API terms; confirm exact wording and logo usage against the current documentation rather than copying an outdated template.

Image URLs use the image base and size documented by TMDb plus each result's `poster_path` or `backdrop_path`. Handle null paths; do not assume every movie has artwork.

## Acceptance checklist

- [ ] New visitors can use the app and understand the demo login behavior.
- [ ] Trending, search, details, credits, genres, and trailer data come from TMDb.
- [ ] Search is debounced and paginated; filters behave consistently.
- [ ] Favorites, last query, and theme survive refresh.
- [ ] Loading, error, empty, and missing-poster states are designed.
- [ ] Pages work on narrow screens and with keyboard navigation.
- [ ] GitLab contains no committed secret; deployment environment is configured.
- [ ] Deep links work on the deployed site; README includes screenshots and live/repo links.

