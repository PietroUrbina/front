import React, { useState } from 'react';
import { Button } from 'react-bootstrap'; // Importar componentes de Bootstrap
import { toast } from 'react-toastify';  // Importar toast para notificaciones
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Íconos para mostrar/ocultar contraseña

const ChangePasswordModal = ({ userId, onClose }) => {
    // Definir los estados para las contraseñas
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Manejar el cambio de la contraseña
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
                nuevaContrasena: newPassword,  // Pasar la nueva contraseña al backend
            });
            toast.success('Contraseña cambiada con éxito');
            onClose(); // Cerrar el modal tras el éxito
        } catch (error) {
            toast.error('Error al cambiar la contraseña');
            console.error('Error al cambiar la contraseña:', error);
        }
    };

    return (
        <div>
            <form>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
                    <div className="input-group">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            className="form-control"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} // Actualiza el estado
                            placeholder="Ingresa la nueva contraseña"
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowNewPassword(!showNewPassword)}
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
                            onChange={(e) => setConfirmPassword(e.target.value)} // Actualiza el estado
                            placeholder="Confirma la nueva contraseña"
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </div>
                </div>
                <div className="form-group text-center">
                    <Button variant="primary" onClick={handlePasswordChange}>
                        Guardar Contraseña
                    </Button>
                    <Button variant="secondary" onClick={onClose} className="mx-2">
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordModal;
