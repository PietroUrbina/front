import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:8000/usuarios/';
const URI_EMPLEADOS = 'http://localhost:8000/empleados/'; // URI para obtener los empleados

const CompEditUsers = () => {
    const [nombre_usuario, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('');  // Estado para el rol del usuario
    const [id_empleado, setIdEmpleado] = useState('');
    const [empleados, setEmpleados] = useState([]); // Estado para almacenar los empleados
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL

    // Definir los roles disponibles
    const roles = ['Administrador', 'Cajero', 'Mozo'];

    useEffect(() => {
        const getUserAndEmpleados = async () => {
            try {
                // Obtener el usuario por ID
                const userRes = await axios.get(`${URI}${id}`);
                if (userRes.data) {
                    setNombre(userRes.data.nombre_usuario || '');
                    setContrasena(userRes.data.contrasena || '');
                    setRol(userRes.data.rol || ''); // Cargar el rol preseleccionado
                    setIdEmpleado(userRes.data.id_empleado || ''); // Cargar el empleado preseleccionado
                }

                // Obtener la lista de empleados
                const empleadosRes = await axios.get(URI_EMPLEADOS);
                setEmpleados(empleadosRes.data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        getUserAndEmpleados();
    }, [id]); // Solo 'id' como dependencia

    // Procedimiento para actualizar
    const actualizar = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URI}${id}`, {
                nombre_usuario,
                contrasena,
                rol,
                id_empleado
            });
            navigate('/usuarios');
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    const cancelar = () => {
        navigate('/usuarios'); // Redireccionar a la página de lista de usuarios
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
                                        type="password"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Rol</label>
                                    <select
                                        value={rol}  // Asegúrate de que el valor esté preseleccionado correctamente
                                        onChange={(e) => setRol(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Selecciona un rol</option>
                                        {roles.map((role, index) => (
                                            <option key={index} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)} {/* Mostrar con la primera letra en mayúscula */}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Empleado</label>
                                    <select
                                        value={id_empleado}
                                        onChange={(e) => setIdEmpleado(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Selecciona un empleado</option>
                                        {empleados.map((empleado) => (
                                            <option key={empleado.id} value={empleado.id}> {/* Usamos 'id' en lugar de 'id_empleado' */}
                                                {empleado.nombre_empleado}
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
