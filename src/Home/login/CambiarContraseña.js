import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './cambiarContraseña.css';

const CambiarContraseña = () => {
  const { userId } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 10) {
      toast.error('La contraseña debe tener al menos 10 caracteres');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/usuarios/change-password/${userId}`, {
        nuevaContrasena: newPassword,
      });
      toast.success('Contraseña cambiada con éxito');
      setPasswordChanged(true);
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
      console.error('Error al cambiar la contraseña:', error);
    }
  };

  const handleSalir = () => {
    navigate('/login');
  };

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <div className="header">
          <button className="close-button" onClick={handleSalir}>×</button>
          <h2>Cambiar Contraseña</h2>
          <p>Ingresa tu nueva contraseña y confírmala.</p>
        </div>
        <form className="form">
          <div className="input-group">
            <label>Nueva Contraseña</label>
            <div className="password-input">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa la nueva contraseña"
                disabled={passwordChanged}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={passwordChanged}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma la nueva contraseña"
                disabled={passwordChanged}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={passwordChanged}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="button-group">
            {passwordChanged ? (
              <Button variant="danger" onClick={handleSalir}>
                Ir al Login
              </Button>
            ) : (
              <Button variant="primary" onClick={handlePasswordChange}>
                Cambiar Contraseña
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarContraseña;
