// src/home/NavSideBar/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === "/usuarios" ? "active" : ""}>
            <Link to="/usuarios">
              <i className="fas fa-user"></i> Usuarios
            </Link>
          </li>
          <li className={location.pathname === "/empleados" ? "active" : ""}>
            <Link to="/empleados">
              <i className="fas fa-briefcase"></i> Empleados
            </Link>
          </li>
          <li className={location.pathname === "/box" ? "active" : ""}>
            <Link to="/box">
              <i className="fas fa-box"></i> Box
            </Link>
          </li>
          <li className={location.pathname === "/categorias" ? "active" : ""}>
            <Link to="/categorias">
              <i className="fas fa-tags"></i> Categorías
            </Link>
          </li>
          <li className={location.pathname === "/productos" ? "active" : ""}>
            <Link to="/productos">
              <i className="fas fa-box-open"></i> Productos
            </Link>
          </li>
          <li className={location.pathname === "/clientes" ? "active" : ""}>
            <Link to="/clientes">
              <i className="fas fa-users"></i> Clientes
            </Link>
          </li>
          <li className={location.pathname === "/inventarios" ? "active" : ""}>
            <Link to="/inventarios">
              <i className="fas fa-warehouse"></i> Inventarios
            </Link>
          </li>
          <li className={location.pathname === "/ventas" ? "active" : ""}>
            <Link to="/ventas">
              <i className="fas fa-shopping-cart"></i> Ventas
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
