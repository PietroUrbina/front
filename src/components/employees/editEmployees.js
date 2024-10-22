import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';  // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify

const URI = 'http://localhost:8000/empleados/';

const CompEditEmployees = () => {
    const [dni, setDni] = useState('');
    const [nombre_empleado, setNombreEmpleado] = useState('');
    const [apellido_empleado, setApellidoEmpleado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [fecha_contratacion, setFechaContratacion] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL

    useEffect(() => {
        // Obtener los datos del empleado por ID
        const getEmployeeById = async () => {
            try {
                const res = await axios.get(`${URI}${id}`);
                if (res.data) {
                    setDni(res.data.dni || '');
                    setNombreEmpleado(res.data.nombre_empleado || '');
                    setApellidoEmpleado(res.data.apellido_empleado || '');
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
                direccion,
                telefono,
                email
            });
            toast.success('Inventario actualizado con éxito');  // Mostrar notificación
            navigate('/empleados');
        } catch (error) {
            toast.success('Error al actualizar el Empleado');
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
                                {/* DNI solo lectura */}
                                <div className="mb-3">
                                    <label className="form-label">Dni</label>
                                    <input
                                        value={dni}
                                        onChange={(e) => setDni(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        readOnly
                                    />
                                </div>
                                {/* Nombre solo lectura */}
                                <div className="mb-3">
                                    <label className="form-label">Nombres del Empleado</label>
                                    <input
                                        value={nombre_empleado}
                                        onChange={(e) => setNombreEmpleado(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        readOnly
                                    />
                                </div>
                                {/* Apellido solo lectura */}
                                <div className="mb-3">
                                    <label className="form-label">Apellido del Empleado</label>
                                    <input
                                        value={apellido_empleado}
                                        onChange={(e) => setApellidoEmpleado(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        readOnly
                                    />
                                </div>
                                {/* Fecha de contratación solo lectura */}
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Contratación</label>
                                    <input
                                        value={fecha_contratacion}
                                        onChange={(e) => setFechaContratacion(e.target.value)}
                                        type="date"
                                        className="form-control"
                                        readOnly
                                    />
                                </div>
                                {/* Dirección editable */}
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
                                {/* Teléfono editable */}
                                <div className="mb-3">
                                    <label className="form-label">Telefono</label>
                                    <input
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        type="text"
                                        maxLength={9}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                {/* Email editable */}
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="form-control"
                                        required
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
