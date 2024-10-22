import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importar íconos

const ChangePasswordModal = ({ userId, onClose }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar la confirmación

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 10) {
            setError('La contraseña debe tener al menos 10 caracteres');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/usuarios/change-password/${userId}`, { newPassword });
            toast.success('Contraseña actualizada con éxito');
            onClose();
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            toast.error('Error al cambiar la contraseña');
        }
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Cambiar Contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label>Nueva Contraseña</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </div>
                </div>
                <div className="mb-3">
                    <label>Confirmar Contraseña</label>
                    <div className="input-group">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </div>
                </div>
                {error && <div className="text-danger">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handlePasswordChange}>
                    Guardar Contraseña
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePasswordModal;
