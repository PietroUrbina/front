import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify

const URI = 'http://localhost:8000/empleados/';
const RENIEC_EMPLEADOS_URI = 'http://localhost:8000/empleados/reniec'; // Ruta para obtener datos del empleado desde el servicio

const CompCreateEmployees = () => {
  const [dni, setDni] = useState('');
  const [nombre_empleado, setNombreEmpleado] = useState('');
  const [apellido_empleado, setApellidoEmpleado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fecha_contratacion, setFechaContratacion] = useState(''); // Estado para fecha de contratación
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const navigate = useNavigate();

  // Función para obtener los datos del empleado según el DNI
  const obtenerDatosReniec = async () => {
    try {
      const response = await axios.post(RENIEC_EMPLEADOS_URI, { dni });
      if (response.data) {
        setNombreEmpleado(response.data.nombreCompleto);
        setApellidoEmpleado(response.data.apellidosCompletos);
        setIsReadOnly(true); // Hace los campos Nombre y Apellido de solo lectura
      }
    } catch (error) {
      console.error('Error al obtener datos del servicio de empleados', error);
    }
  };

  const handleDniChange = (e) => {
    const value = e.target.value;
    setDni(value);
    setButtonDisabled(value.length !== 8);
    if (e.target.value.length <= 8) {
      setDni(e.target.value);
    }
  };

  const handleTelefonoChange = (e) => {
    if (e.target.value.length <= 9) {
      setTelefono(e.target.value);
    }
  };

  // Función para obtener la fecha actual y formatearla
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const año = hoy.getFullYear();
    return `${año}-${mes}-${dia}`;
  };

  useEffect(() => {
    // Establecer la fecha de contratación como la fecha actual por defecto
    setFechaContratacion(obtenerFechaActual());
  }, []); // Ejecutar solo al cargar el componente

  // Procedimiento para guardar el nuevo Empleado
  const guardar = async (e) => {
    e.preventDefault();

    const empleadoData = {
      dni,
      nombre_empleado,
      apellido_empleado,
      direccion,
      telefono,
      email,
      fecha_contratacion
    };

    try {
      await axios.post(URI, empleadoData);
      toast.success('Empleado registrado con éxito');  // Mostrar éxito
      navigate('/empleados');
    } catch (error) {
      toast.error('Error al crear el Empleado');
      console.error('Error al crear el Empleado:', error);
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
              <h3>Crear un Nuevo Empleado</h3>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                <div className="mb-3">
                  <label className="form-label">DNI del Empleado</label>
                  <input
                    value={dni}
                    onChange={handleDniChange}
                    type="text"
                    maxLength={8}
                    className="form-control"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-success mt-2"
                    onClick={obtenerDatosReniec}
                    disabled={buttonDisabled}
                  >
                    Ver Empleado
                  </button>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombres del Empleado</label>
                  <input
                    value={nombre_empleado}
                    onChange={(e) => setNombreEmpleado(e.target.value)}
                    type="text"
                    className="form-control"
                    readOnly={isReadOnly}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellidos del Empleado</label>
                  <input
                    value={apellido_empleado}
                    onChange={(e) => setApellidoEmpleado(e.target.value)}
                    type="text"
                    className="form-control"
                    readOnly={isReadOnly}
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
                  <label className="form-label">Teléfono</label>
                  <input
                    value={telefono}
                    onChange={handleTelefonoChange}
                    type="text"
                    maxLength={9}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Contratación</label>
                  <input
                    value={fecha_contratacion}
                    onChange={(e) => setFechaContratacion(e.target.value)}
                    type="date"
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
};

export default CompCreateEmployees;
