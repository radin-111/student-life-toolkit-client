import React from 'react';
import { useTheme } from '../Context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-circle btn-ghost transition-all duration-300 ${
        isDarkMode ? 'hover:bg-purple-900/20' : 'hover:bg-gray-200'
      }`}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <FaSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <FaMoon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

export default DarkModeToggle;
