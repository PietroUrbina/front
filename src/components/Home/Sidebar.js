// src/components/Home/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import image from "../../assets/Logo.png";
import './styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <image src="/assets/Logo.png" alt="Logo" className="logo-image" />
      </div>

      <ul className="menu">
        <li>
          <Link to="/home">
            <i className="bx bxs-dashboard"></i>
            <span>Inicio</span>
          </Link>
        </li>
        <li>
          <Link to="/venta">
            <i className="bx bx-dollar-circle"></i>
            <span>Generar venta</span>
          </Link>
        </li>
        <li>
          <Link to="/facturas">
            <i className="bx bx-bar-chart-alt-2"></i>
            <span>Ventas Realizadas</span>
          </Link>
        </li>
        <li>
          <Link to="/almacen">
            <i className="bx bxs-archive"></i>
            <span>Almacén</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
