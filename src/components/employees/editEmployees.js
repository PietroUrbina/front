import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:8000/empleados/';

const CompEditEmployees = () => {
    const [nombre_empleado, setNombreEmpleado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [fecha_contratacion, setFechaContratacion] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL

    useEffect(() => {
        // Obtener los datos del empleados por ID
        const getEmployeeById = async () => {
            try {
                const res = await axios.get(`${URI}${id}`);
                if (res.data) {
                    setNombreEmpleado(res.data.nombre_empleado || '');
                    setDireccion(res.data.direccion || '');
                    setTelefono(res.data.telefono || '');
                    setEmail(res.data.email || '');
                    setFechaContratacion(res.data.fecha_contratacion || '');
                }
            } catch (error) {
                console.error("Error al obtener los datos del Empleado:", error);
            }
        };

        getEmployeeById();
    }, [id]); // Solo 'id' como dependencia

    // Procedimiento para actualizar
    const actualizar = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URI}${id}`, {
                nombre_empleado,
                direccion,
                telefono,
                email,
                fecha_contratacion
            });
            navigate('/empleados');
        } catch (error) {
            console.error("Error al actualizar el Empleado:", error);
        }
    };

    const cancelar = () => {
        navigate('/empleados'); 
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Editar y Actualizar Empleado</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={actualizar}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del Empleado</label>
                                    <input
                                        value={nombre_empleado}
                                        onChange={(e) => setNombreEmpleado(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Direccion</label>
                                    <input
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Telefono</label>
                                    <input
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Contratacion</label>
                                    <input
                                        value={fecha_contratacion}
                                        onChange={(e) => setFechaContratacion(e.target.value)}
                                        type="date"
                                        className="form-control"
                                    />
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

export default CompEditEmployees;
