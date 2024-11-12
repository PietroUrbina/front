import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../assets/Logo.png';

const Sidebar = ({ isMinimized }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="sidebar-logo">
        <Link to="/usuarios">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <div className="section-divider">Menú</div>
          <li className={isActive("/Inicio") ? "active" : ""}>
            <Link to="/Inicio">
              <i className="fas fa-solid fa-house"></i> {!isMinimized && "Inicio"}
            </Link>
          </li>
          <li className={isActive("/usuarios") ? "active" : ""}>
            <Link to="/usuarios">
              <i className="fas fa-solid fa-user"></i> {!isMinimized && "Usuarios"}
            </Link>
          </li>
          <li className={isActive("/empleados") ? "active" : ""}>
            <Link to="/empleados">
              <i className="fas fa-user-tie"></i> {!isMinimized && "Empleados"}
            </Link>
          </li>
          <li className={isActive("/box") ? "active" : ""}>
            <Link to="/box">
              <i className="fas fa-box"></i> {!isMinimized && "Box"}
            </Link>
          </li>
          <li className={isActive("/clientes") ? "active" : ""}>
            <Link to="/clientes">
              <i className="fas fa-users"></i> {!isMinimized && "Clientes"}
            </Link>
          </li>
          <div className="section-divider">Gestion Almacen</div>
          <li className={isActive("/categorias") ? "active" : ""}>
            <Link to="/categorias">
              <i className="fas fa-layer-group"></i> {!isMinimized && "Categorías"}
            </Link>
          </li>
          <li className={isActive("/productos") ? "active" : ""}>
            <Link to="/productos">
              <i className="fas fa-box-open"></i> {!isMinimized && "Productos"}
            </Link>
          </li>
          <li className={isActive("/inventarios") ? "active" : ""}>
            <Link to="/inventarios">
              <i className="fas fa-clipboard-list"></i> {!isMinimized && "Inventarios"}
            </Link>
          </li>
          <div className="section-divider">Procesos</div>
          <li className={isActive("/ventas") ? "active" : ""}>
            <Link to="/ventas">
              <i className="fas fa-shopping-cart"></i> {!isMinimized && "Ventas"}
            </Link>
          </li>
          <li className={isActive("/ventasRealizadas") ? "active" : ""}>
            <Link to="/ventasRealizadas">
              <i className="fas fa-receipt"></i> {!isMinimized && "Ventas Realizadas"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;