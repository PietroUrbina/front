// src/App.js
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos los componentes
import CompShowUsers from './components/users/ShowUsers';
import CompCreateUsers from './components/users/createUsers';
import CompEditUsers from "./components/users/EditUsers";

import CompShowBox from './components/box/showBox';
import CompCreateBox from './components/box/createBox';
import CompEditBox from "./components/box/editBox";

import CompshowProducts from './components/products/showProducts';
import CompcreateProducts from './components/products/createProducts';
import CompeditProducts from "./components/products/editProducts";

import Sidebar from './components/Home/Sidebar';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="App">
      <BrowserRouter>
        {/* Sidebar que puede colapsarse */}
        <Sidebar isCollapsed={isCollapsed} />

        {/* Navbar que controla el sidebar */}c
        <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
          <Routes> */
            {/* <Route path='/' element={<CompShowUsers />} />
            <Route path='/create' element={<CompCreateUsers />} />
            <Route path='/edit/:id' element={<CompEditUsers />} /> */}

            {/* <Route path='/' element={<CompShowBox />} />
            <Route path='/create' element={<CompCreateBox />} />
            <Route path='/edit/:id' element={<CompEditBox />} /> */}

            <Route path='/' element={<CompshowProducts />} />
            <Route path='/create' element={<CompcreateProducts />} />
            <Route path='/edit/:id' element={<CompeditProducts />} />
            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
