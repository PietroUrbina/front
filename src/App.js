import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importamos nuestros componentes principales
import Login from './Home/login/Login';
import Logout from './Home/login/Logout';

// import NavSidebar from './Home/NavSideBar/Sidebar';


// Importamos los componentes de las tablas
import CompShowUsers from './components/users/ShowUsers';
import CompCreateUsers from './components/users/createUsers';

import CompShowEmployees from './components/employees/showEmployees';
import CompCreateEmployees from './components/employees/createEmployees';
import CompEditEmployees from './components/employees/editEmployees';

import CompShowBox from './components/box/showBox';
import CompCreateBox from './components/box/createBox';
import CompEditBox from './components/box/editBox';

import CompShowProducts from './components/products/showProducts';
import CompCreateProducts from './components/products/createProducts';
import CompEditProducts from './components/products/editProducts';

import CompShowCustomers from './components/customers/showCustomers';
import CompCreateCustomers from './components/customers/createCustomers';
import CompEditCustomers from './components/customers/editCustomers';

import CompShowInventories from './components/inventory/showInventories';
import CompCreateInventories from './components/inventory/createInventory'
import CompEditInventories from './components/inventory/editInventory'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Redirigir desde la raíz "/" hacia "/login" */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Ruta para el Login */}
          <Route path="/login" element={ <Login /> } />

          {/* Ruta para Dashboard*/}
      

          {/* Rutas para Usuarios */}
          <Route path="/usuarios" element={ <CompShowUsers /> }/>
          <Route path="/usuarios/create" element={ <CompCreateUsers /> }/>

          {/* Rutas para Empleados */}
          <Route path="/empleados" element={ <CompShowEmployees /> }/>
          <Route path="/empleados/create" element={ <CompCreateEmployees /> }/>
          <Route path="/empleados/edit/:id" element={ <CompEditEmployees /> }/>

          {/* Rutas para Box */}
          <Route path="/box" element={ <CompShowBox /> }/>
          <Route path="/box/create" element={ <CompCreateBox /> }/>
          <Route path="/box/edit/:id" element={ <CompEditBox/> }/>

          {/* Rutas para Productos */}
          <Route path="/productos" element={<CompShowProducts />}/>
          <Route path="/productos/create" element={ <CompCreateProducts /> }/>
          <Route path="/productos/edit/:id" element={ <CompEditProducts /> }/>

          {/* Rutas para Clientes */}
          <Route path="/clientes" element={ <CompShowCustomers /> }/>
          <Route path="/clientes/create" element={ <CompCreateCustomers /> }/>
          <Route path="/clientes/edit/:id" element={ <CompEditCustomers /> }/>

          {/* Rutas para Inventarios */}
          <Route path="/inventarios" element={ <CompShowInventories /> }/>
          <Route path="/inventarios/create" element={ <CompCreateInventories /> }/>
          <Route path="/inventarios/edit/:id" element={ <CompEditInventories /> }/>

          {/* Ruta para Logout */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
