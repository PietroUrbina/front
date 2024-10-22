import React, { useState } from 'react';
import './Sidebar.css'; // Asegúrate de que los estilos sean correctos
import { Link } from 'react-router-dom';

const NavSidebar = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
      {/* Sidebar */}
      <div className={`navigation ${isActive ? 'active' : ''}`}>
        <ul>
          <li>
            <Link to="#">
              <span className="icon"><ion-icon name="logo-apple"></ion-icon></span>
              <span className="title" style={{ fontSize: '1.5em', fontWeight: 500 }}>Brand Name</span>
            </Link>
          </li>
          <li className="hovered">
            <Link to="#">
              <span className="icon"><ion-icon name="home-outline"></ion-icon></span>
              <span className="title">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <span className="icon"><ion-icon name="people-outline"></ion-icon></span>
              <span className="title">Customers</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <span className="icon"><ion-icon name="chatbubble-outline"></ion-icon></span>
              <span className="title">Message</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <span className="icon"><ion-icon name="help-outline"></ion-icon></span>
              <span className="title">Help</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <span className="icon"><ion-icon name="settings-outline"></ion-icon></span>
              <span className="title">Settings</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
              <span className="title">Password</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <span className="icon"><ion-icon name="log-out-outline"></ion-icon></span>
              <span className="title">Sign Out</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main ${isActive ? 'active' : ''}`}>
        <div className="topbar">
          <div className="toggle" onClick={toggleSidebar}>
            <ion-icon name="menu-outline"></ion-icon>
          </div>
          <div className="search">
            <label>
              <input type="text" placeholder="Search here" />
              <ion-icon name="search-outline"></ion-icon>
            </label>
          </div>
          <div className="user">
            <img src="/assets/user.jpg" alt="User" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;
