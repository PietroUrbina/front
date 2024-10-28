import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RecuperarUsuario.css'; // Asegúrate de importar el CSS

const RecuperarUsuario = () => {
  const [correo, setCorreo] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [error, setError] = useState('');
  const [correoEnviado, setCorreoEnviado] = useState(false); // Estado para controlar si se envió el correo
  const navigate = useNavigate(); // Hook de navegación para redirigir

  const handleRecuperarUsuario = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    try {
      const response = await axios.post('http://localhost:8000/usuarios/recuperar-usuario', { correo });
      if (response.data.message === 'Correo enviado') {
        setMensajeExito('Te hemos enviado un correo con tu nombre de usuario y un enlace para cambiar tu contraseña.');
        setCorreoEnviado(true); // Cambiar estado cuando el correo se envía
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No se encontró ningún usuario con ese correo.');
      } else {
        setError('Hubo un error al procesar la solicitud.');
      }
    }
  };

  // Manejar el clic para regresar al login
  const handleRegresar = () => {
    navigate('/login'); // Redirigir al login
  };

  return (
    <div className="recuperar-container">
      <button className="cancel-button" onClick={handleRegresar}>X</button>
      <h2>Recuperar Usuario</h2>
      <p>Ingresa tu correo electrónico registrado para recuperar tu usuario y cambiar la contraseña.</p>
      <form onSubmit={handleRecuperarUsuario}>
        <div className="input-container">
          <label>Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            disabled={correoEnviado} // Desactivar el campo si ya se envió el correo
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {mensajeExito && <div className="success-message">{mensajeExito}</div>}
        
        {/* Si el correo ya fue enviado, mostrar botón de "Regresar" */}
        {correoEnviado ? (
          <button type="button" className="recuperar-button regresar-button" onClick={handleRegresar}>
            Regresar
          </button>
        ) : (
          <button type="submit" className="recuperar-button">
            Enviar
          </button>
        )}
      </form>
    </div>
  );
};

export default RecuperarUsuario;
