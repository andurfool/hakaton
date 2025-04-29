import { useState, useEffect } from 'react';
import { useWebApp } from '../../contexts/WebAppContext';

const ThemeToggle = () => {
  const { colorScheme, setColorScheme } = useWebApp();
  const [theme, setTheme] = useState(colorScheme || 'light');

  useEffect(() => {
    // Update the theme when colorScheme changes from context
    if (colorScheme) {
      setTheme(colorScheme);
      document.documentElement.setAttribute('data-theme', colorScheme);
    }
  }, [colorScheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update the context if it exists
    if (setColorScheme) {
      setColorScheme(newTheme);
    }
  };

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle; 