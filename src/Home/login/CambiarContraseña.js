import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import axios from 'axios';
import { Button } from 'react-bootstrap'; 
import { toast } from 'react-toastify';  
import { FaEye, FaEyeSlash } from 'react-icons/fa';  

const CambiarContraseña = () => {
  const { userId } = useParams();  // Captura el userId de la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false); // Estado para verificar si la contraseña fue cambiada
  const navigate = useNavigate();  // Hook para redirigir al login

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
      console.log('UserId:', userId);  // Verifica que userId no sea undefined
      await axios.put(`http://localhost:8000/usuarios/change-password/${userId}`, {
        nuevaContrasena: newPassword,  
      });
      toast.success('Contraseña cambiada con éxito');
      setPasswordChanged(true);  // Actualiza el estado indicando que la contraseña fue cambiada
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
      console.error('Error al cambiar la contraseña:', error);
    }
  };

  const handleSalir = () => {
    navigate('/login');  // Redirigir al login
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <div className="form-header">
          <h2>Cambiar Contraseña</h2>
          <button className="close-button" onClick={handleSalir}>×</button>
        </div>
        <p>Ingresa tu nueva contraseña y confírmala.</p>
        <form className="form-body">
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Ingresa la nueva contraseña"
                disabled={passwordChanged} // Desactiva el campo si ya se cambió la contraseña
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={passwordChanged} // Desactiva el botón si ya se cambió la contraseña
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirma la nueva contraseña"
                disabled={passwordChanged} // Desactiva el campo si ya se cambió la contraseña
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={passwordChanged} // Desactiva el botón si ya se cambió la contraseña
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </div>
          <div className="form-group text-center form-footer">
            {passwordChanged ? (
              <Button 
                variant="danger"  // Cambia el color del botón a rojo
                onClick={handleSalir}  // Redirige al login cuando se hace clic
              >
                Ir al Login
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handlePasswordChange}
              >
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
