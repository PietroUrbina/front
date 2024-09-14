import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import image from "../../assets/Logo.png";  // Importando la imagen correctamente
import './styles/Sidebar.css';  // Importando los estilos
import './styles/Navbar.css';   // Importando los estilos del navbar

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);  // Estado para controlar la apertura/cierre del menú

  // Función para alternar el estado de apertura/cierre del menú
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Barra superior */}
      <div className="navbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          <i className="bx bx-menu"></i>  {/* Ícono de menú fijo */}
        </button>
      
        <h1 className="navbar-title">Disco Bar</h1>
        <div className="navbar-right">
          <i className="bx bxs-bell notification-icon"></i>
          <span className="username">Daniel</span>
          <img src="/assets/user.png" alt="Usuario" className="user-avatar" />
        </div>
      </div>

      {/* Sidebar */}
      <div className={isOpen ? "sidebar open" : "sidebar collapsed"}>
        <div className="logo">
          <img src={image} alt="Logo" className="logo-image" />
        </div>

        <ul className="menu">
          <li>
            <Link to="/home">
              <i className="bx bxs-home"></i>
              {isOpen && <span>Inicio</span>}
            </Link>
          </li>
          <li>
            <Link to="/venta">
              <i className="bx bx-dollar-circle"></i>
              {isOpen && <span>Generar venta</span>}
            </Link>
          </li>
          <li>
            <Link to="/facturas">
              <i className="bx bx-bar-chart-alt-2"></i>
              {isOpen && <span>Ventas Realizadas</span>}
            </Link>
          </li>
          <li>
            <Link to="/almacen">
              <i className="bx bxs-archive"></i>
              {isOpen && <span>Almacén</span>}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;