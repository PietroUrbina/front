import React from 'react';
import './Navbar.css';

const Navbar = ({ toggleSidebar, usuario }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <span className="navbar-title">Eclipse Night 🌒</span>
      </div>
      <div className="navbar-right">
        <i className="fas fa-bell navbar-icon"></i>
        <div className="navbar-user">
          <span className="navbar-username">Hola, {usuario?.nombre_usuario || 'Invitado'}</span>
          <div className="navbar-dropdown">
            <a href="/logout"><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
