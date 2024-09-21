// DarkModeToggle.jsx
import React from 'react';
import { IoIosBulb } from 'react-icons/io';

function DarkModeToggle({ darkMode, setDarkMode }) {
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="dark-mode-toggle">
      <button className="dark-button" onClick={toggleDarkMode}>
        <IoIosBulb color={darkMode ? 'yellow' : 'gray'} />
      </button>
    </div>
  );
}

export default DarkModeToggle;
