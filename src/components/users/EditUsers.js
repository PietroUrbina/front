import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:8000/usuarios/';

const CompEditUsers = () => {
    const [nombre_usuario, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL

    // Definir los roles disponibles
    const roles = ['administrador', 'cajero', 'mozo'];

    useEffect(() => {
        // Definir la función dentro de useEffect para evitar dependencias innecesarias
        const getUserBlogId = async () => {
            try {
                const res = await axios.get(`${URI}${id}`);
                if (res.data) {
                    setNombre(res.data.nombre_usuario || '');
                    setContrasena(res.data.contrasena || '');
                    setRol(res.data.rol || '');
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            }
        };

        getUserBlogId();
    }, [id]); // Solo 'id' como dependencia

    // Procedimiento para actualizar
    const actualizar = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URI}${id}`, {
                nombre_usuario,
                contrasena,
                rol
            });
            navigate('/usuarios');
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    const cancelar = () => {
        navigate('/usuarios'); // Redireccionar a la página de lista de clientes
      };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Editar y Actualizar Usuario</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={actualizar}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de Usuario</label>
                                    <input
                                        value={nombre_usuario}
                                        onChange={(e) => setNombre(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        value={contrasena}
                                        onChange={(e) => setContrasena(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Rol</label>
                                    <select
                                        value={rol}
                                        onChange={(e) => setRol(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Selecciona un rol</option>
                                        {roles.map((role, index) => (
                                            <option key={index} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group text-center">
                                <button type="submit" className="btn btn-primary mr-4 mx-4">Guardar</button>
                                <button type="button" className="btn btn-danger" onClick={cancelar}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompEditUsers;
