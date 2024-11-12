import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { dotSpinner } from 'ldrs';
import './RecuperarUsuario.css';

dotSpinner.register();

const RecuperarUsuario = () => {
  const [correo, setCorreo] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [error, setError] = useState('');
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecuperarUsuario = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/usuarios/recuperar-usuario', { correo });
      if (response.data.message === 'Correo enviado') {
        setMensajeExito('Te hemos enviado un correo con tu nombre de usuario y un enlace para cambiar tu contraseña.');
        setCorreoEnviado(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No se encontró ningún usuario con ese correo.');
      } else {
        setError('Hubo un error al procesar la solicitud.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegresar = () => {
    navigate('/login');
  };

  return (
    <div className="recuperar-container">
      <div className="form-content">
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
              disabled={correoEnviado || loading}
            />
          </div>
          {loading ? (
            <div className="loader-container">
              <l-dot-spinner size="40" color="#007bff" speed="0.9"></l-dot-spinner>
            </div>
          ) : (
            <>
              {error && <div className="error-message">{error}</div>}
              {mensajeExito && <div className="success-message">{mensajeExito}</div>}
              {correoEnviado ? (
                <button type="button" className="recuperar-button regresar-button" onClick={handleRegresar}>
                  Regresar
                </button>
              ) : (
                <button type="submit" className="recuperar-button">
                  Enviar
                </button>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RecuperarUsuario;
