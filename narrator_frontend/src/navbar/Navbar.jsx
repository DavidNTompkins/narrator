import React from 'react';
import './Navbar.css';

const Navbar = ({ children }) => {
  return (
    <header className="navbar">
      <nav className="navbar-content">
        {children}
      </nav>
    </header>
  );
};

export default Navbar;
