import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos los componentes
import CompShowUsers from './components/users/ShowUsers';
import CompCreateUsers from './components/users/createUsers';
import CompEditUsers from "./components/users/EditUsers";
import Sidebar from './components/Home/Sidebar';
import Navbar from './components/Home/Navbar';

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

        {/* Navbar que controla el sidebar */}
        <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
          {/* <Navbar toggleSidebar={toggleSidebar} /> */}
          <Routes>
            <Route path='/' element={<CompShowUsers />} />
            <Route path='/create' element={<CompCreateUsers />} />
            <Route path='/edit/:id' element={<CompEditUsers />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
