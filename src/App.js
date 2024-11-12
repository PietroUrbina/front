import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './Home/NavSideBar/Sidebar';
import Navbar from './Home/NavSideBar/Navbar';

import Login from './Home/login/Login';
import Logout from './Home/login/Logout';
import RecuperarUsuario from './Home/login/RecuperarUsuario';
import CambiarContraseña from './Home/login/CambiarContraseña';

import Dashboard from './components/dasboard/Dashboard';

import CompShowUsers from './components/users/ShowUsers';
import CompCreateUsers from './components/users/createUsers';
import CompEditUser from './components/users/EditUsers';

import CompShowEmployees from './components/employees/showEmployees';
import CompCreateEmployees from './components/employees/createEmployees';
import CompEditEmployees from './components/employees/editEmployees';

import CompShowBox from './components/box/showBox';
import CompCreateBox from './components/box/createBox';
import CompEditBox from './components/box/editBox';

import CompShowCategorias from './components/categories/showCategories';
import CompCreateCategorias from './components/categories/createCategories';
import CompEditCategorias from './components/categories/editCategories';

import CompShowProducts from './components/products/showProducts';
import CompCreateProducts from './components/products/createProducts';
import CompEditProducts from './components/products/editProducts';

import CompShowCustomers from './components/customers/showCustomers';
import CompCreateCustomers from './components/customers/createCustomers';
import CompEditCustomers from './components/customers/editCustomers';

import CompShowInventories from './components/inventory/showInventories';
import CompCreateInventories from './components/inventory/createInventory';
import CompEditInventories from './components/inventory/editInventory';

import CompVenta from './components/ventas/ventas';
import CompVentasRealizadas from './components/ventasRealizadas/ventasRealizadas';

function App() {
  const location = useLocation();
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    try {
      const parsedUsuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
      return parsedUsuario;
    } catch (error) {
      localStorage.removeItem('usuario');
      return null;
    }
  });

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const actualizarUsuario = (nuevoUsuario) => {
    setUsuario(nuevoUsuario);
    if (nuevoUsuario) {
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    } else {
      localStorage.removeItem('usuario');
    }
  };

  const isLoginRoute = location.pathname.startsWith("/login");

  return (
    <div className={`app-container ${isLoginRoute ? 'login-mode' : ''}`}>
      {!isLoginRoute && (
        <>
          {isSidebarVisible && (
            <div className="sidebar-container">
              <Sidebar />
            </div>
          )}
          <div className={`main-container ${isSidebarVisible ? '' : 'full-width'}`}>
            <div className="navbar-container">
              <Navbar toggleSidebar={toggleSidebar} usuario={usuario} />
            </div>
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                
                <Route path="/Inicio" element={<Dashboard />} />

                <Route path="/usuarios" element={<CompShowUsers />} />
                <Route path="/usuarios/create" element={<CompCreateUsers />} />
                <Route path="/usuarios/edit/:id" element={<CompEditUser />} />

                <Route path="/empleados" element={<CompShowEmployees />} />
                <Route path="/empleados/create" element={<CompCreateEmployees />} />
                <Route path="/empleados/edit/:id" element={<CompEditEmployees />} />

                <Route path="/box" element={<CompShowBox />} />
                <Route path="/box/create" element={<CompCreateBox />} />
                <Route path="/box/edit/:id" element={<CompEditBox />} />

                <Route path="/categorias" element={<CompShowCategorias />} />
                <Route path="/categorias/create" element={<CompCreateCategorias />} />
                <Route path="/categorias/edit/:id" element={<CompEditCategorias />} />

                <Route path="/productos" element={<CompShowProducts />} />
                <Route path="/productos/create" element={<CompCreateProducts />} />
                <Route path="/productos/edit/:id" element={<CompEditProducts />} />

                <Route path="/clientes" element={<CompShowCustomers />} />
                <Route path="/clientes/create" element={<CompCreateCustomers />} />
                <Route path="/clientes/edit/:id" element={<CompEditCustomers />} />

                <Route path="/inventarios" element={<CompShowInventories />} />
                <Route path="/inventarios/create" element={<CompCreateInventories />} />
                <Route path="/inventarios/edit/:id" element={<CompEditInventories />} />

                <Route path="/ventas" element={<CompVenta usuario={usuario} />} />
                <Route path="/ventasRealizadas" element={<CompVentasRealizadas usuario={usuario} />} />

                <Route path="/logout" element={<Logout actualizarUsuario={actualizarUsuario} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
      {isLoginRoute && (
        <div className="login-container">
          <Routes>
            <Route path="/login" element={<Login actualizarUsuario={actualizarUsuario} />} />
            <Route path="/login/recuperar-usuario" element={<RecuperarUsuario />} />
            <Route path="/login/cambiar-contraseña/:userId" element={<CambiarContraseña />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
