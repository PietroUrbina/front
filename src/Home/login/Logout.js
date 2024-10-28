import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ actualizarUsuario }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // Eliminar el token de localStorage
    actualizarUsuario(null); // Limpia el usuario en App.js
    navigate('/login'); // Redirigir al login
  }, [actualizarUsuario, navigate]);

  return null;
};

export default Logout;
