import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import backgroundImage from '../../assets/fondo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = ({ actualizarUsuario }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/usuarios/login', {
        nombre_usuario: nombreUsuario,
        contrasena,
      });
      const token = response.data.token;
      const usuario = response.data.usuario;

      // Guardar tanto el token como el usuario en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      actualizarUsuario(usuario); // Actualizar usuario en App.js
      navigate('/usuarios'); // Redirigir a la página de usuarios
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas');
        showErrorToast('Contraseña Incorrecta');
      } else if (error.response && error.response.status === 404) {
        setError('El usuario no existe');
        showErrorToast('Usuario y contraseña incorrecto, o el usuario no existe');
      } else {
        setError('Error desconocido');
      }
    }
  };

  const showErrorToast = (message) => {
    setError(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-box">
        <h2>Inicio de Sesion</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label>Usuario</label>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label>Contraseña</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          <div className="actions">
            <Link to="/login/recuperar-usuario" className="forgot-password">¿Olvidaste tu usuario o contraseña?</Link>
          </div>
          <button type="submit" className="login-button">Ingresar</button>
        </form>
      </div>

      {showToast && (
        <div className={`error-toast ${showToast ? 'show' : ''}`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Login;
