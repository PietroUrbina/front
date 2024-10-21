// src/Home/login/RutaProtegida.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem('token'); // Obtener el token desde localStorage

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" />;
  }

  // Si hay token, renderiza los hijos (las rutas protegidas)
  return children;
};

export default RutaProtegida;
