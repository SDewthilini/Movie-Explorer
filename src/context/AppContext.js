import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);
const safeRead = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
};
const safeWrite = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ }
};

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => safeRead('cine-favorites', []));
  const [query, setQuery] = useState(() => safeRead('cine-last-query', ''));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = safeRead('cine-theme', null);
    return saved === null ? window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true : saved;
  });
  const [user, setUser] = useState(() => safeRead('cine-user', null));

  const toggleFavorite = useCallback((movie) => setFavorites((current) => {
    const next = current.some((item) => item.id === movie.id)
      ? current.filter((item) => item.id !== movie.id)
      : [movie, ...current];
    safeWrite('cine-favorites', next);
    return next;
  }), []);
  const updateQuery = useCallback((value) => { setQuery(value); safeWrite('cine-last-query', value); }, []);
  const toggleTheme = useCallback(() => setDarkMode((value) => { safeWrite('cine-theme', !value); return !value; }), []);
  const login = useCallback((name) => { const next = { name }; setUser(next); safeWrite('cine-user', next); }, []);
  const logout = useCallback(() => { setUser(null); safeWrite('cine-user', null); }, []);

  const value = useMemo(() => ({ favorites, toggleFavorite, query, updateQuery, darkMode, toggleTheme, user, login, logout }), [favorites, toggleFavorite, query, updateQuery, darkMode, toggleTheme, user, login, logout]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
