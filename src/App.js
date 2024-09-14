import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos los componentes de las tablas
import CompShowUsers from './components/users/showUsers';
import CompCreateUsers from './components/users/createUsers';
import CompEditUsers from './components/users/editUsers';

import CompShowBox from './components/box/showBox';
import CompCreateBox from './components/box/createBox';
import CompEditBox from "./components/box/editBox";

import CompShowProducts from './components/products/showProducts';
import CompCreateProducts from './components/products/createProducts';
import CompEditProducts from './components/products/editProducts';

import CompShowCustomers from './components/customers/showCustomers';
import CompCreateCustomers from './components/customers/createCustomers';
import CompEditCustomers from './components/customers/editCustomers';

import Dashboard from './components/dasboards/repostesDashboard';
import Sidebar from './components/Home/Sidebar';

function App() {

  const [isCollapsed] = useState(true);

  return (
    <div className="App">
      <BrowserRouter>
        {/* Sidebar que puede colapsarse */}
        <Sidebar isCollapsed={isCollapsed} />

        {/* Definir las rutas para cada tabla */}
        <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
          <Routes>
            {/* Ruta para el Dashboard en Inicio */}
            <Route path="/Home" element={<Dashboard />} />

            {/* Rutas para Usuarios */}
            <Route path='/usuarios' element={<CompShowUsers />} />
            <Route path='/usuarios/create' element={<CompCreateUsers />} />
            <Route path='/usuarios/edit/:id' element={<CompEditUsers />} />

            {/* Rutas para Box */}
            <Route path='/box' element={<CompShowBox />} />
            <Route path='/box/create' element={<CompCreateBox />} />
            <Route path='/box/edit/:id' element={<CompEditBox />} />

            {/* Rutas para Productos */}
            <Route path='/productos' element={<CompShowProducts />} />
            <Route path='/productos/create' element={<CompCreateProducts />} />
            <Route path='/productos/edit/:id' element={<CompEditProducts />} />

            {/* Rutas para Clientes */}
            <Route path='/clientes' element={<CompShowCustomers />} />
            <Route path='/clientes/create' element={<CompCreateCustomers />} />
            <Route path='/clientes/edit/:id' element={<CompEditCustomers />} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
