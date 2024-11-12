import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ toggleSidebar, usuario }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // referencia para el menú desplegable

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Cierra el menú desplegable si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <button className="navbar-fullscreen" onClick={handleFullScreen}>
          <i className="fas fa-expand"></i>
        </button>
      </div>
      <div className="navbar-right">
        <i className="fas fa-bell navbar-icon" title="Notificaciones"></i>
        <div className="navbar-user" onClick={toggleDropdown} ref={dropdownRef}>
          <span className="navbar-username">
            {usuario?.nombre_usuario || 'Invitado'}
          </span>
          <i className="fas fa-caret-down username-caret"></i>
          {isDropdownOpen && (
            <div className="navbar-dropdown">
              <a href="/profile">
                <i className="fas fa-user"></i> Mi cuenta
              </a>
              <a href="/logout" className="logout-link">
                <i className="fas fa-sign-out-alt"></i> Cerrar sesión
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
