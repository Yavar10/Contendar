import { useState, useEffect } from 'react';

const STORAGE_KEY = 'contendar_theme_preference';

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'dark'; // Default to signature dark appearance
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  let resolved = theme;
  if (theme === 'system') {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolved = isDark ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', resolved);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        applyTheme('system');
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme]);

  const setAppTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return { theme, setTheme: setAppTheme };
}

