import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import backgroundImage from '../../assets/fondo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importar FontAwesome
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Íconos de ojo

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false); // Estado para mostrar la tarjeta de error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/usuarios/login', {
        nombre_usuario: nombreUsuario,
        contrasena,
      });
      const token = response.data.token;
      localStorage.setItem('token', token); // Guardar el token en localStorage
      navigate('/usuarios'); // Redirigir a una página protegida
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas');
        showErrorToast('Ingresaste mal tu contraseña');
      } else if (error.response && error.response.status === 404) {
        setError('El usuario no existe');
        showErrorToast('El usuario no existe');
      } else {
        setError('Error desconocido');
      }
    }
  };

  // Función para mostrar la tarjeta de error durante 3 segundos
  const showErrorToast = (message) => {
    setError(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Desaparece después de 3 segundos
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}>
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
                type={showPassword ? 'text' : 'password'} // Mostrar u ocultar contraseña
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* Ícono de ojo */}
              </span>
            </div>
          </div>
          <div className="actions">
            {/* <a href="#" className="forgot-password">Olvidaste tu contraseña?</a> */}
          </div>
          <button type="submit" className="login-button">Ingresar</button>
        </form>
      </div>

      {/* Tarjeta emergente de error */}
      {showToast && (
        <div className={`error-toast ${showToast ? 'show' : ''}`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Login;
