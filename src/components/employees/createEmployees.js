import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ring2 } from 'ldrs'; // Importar el loader
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ring2.register(); // Registrar el loader

const URI = 'http://localhost:8000/empleados/';
const RENIEC_EMPLEADOS_URI = 'http://localhost:8000/empleados/reniec';

const CompCreateEmployees = () => {
  const [dni, setDni] = useState('');
  const [nombre_completo, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fecha_contratacion, setFechaContratacion] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el loader
  const navigate = useNavigate();

  const obtenerDatosReniec = async () => {
    setLoading(true); // Mostrar el loader
    try {
      const response = await axios.post(RENIEC_EMPLEADOS_URI, { dni });
      if (response.data) {
        setNombreCompleto(response.data.nombreCompleto);
        setIsReadOnly(true); // Hacer el campo nombre no editable
        toast.success('Datos obtenidos correctamente');
      } else {
        setIsReadOnly(false);
        toast.error('No se encontraron datos para este DNI');
      }
    } catch (error) {
      setIsReadOnly(false);
      toast.error('Error al obtener datos del servicio');
      console.error('Error al obtener datos del servicio:', error);
    } finally {
      setLoading(false); // Ocultar el loader
    }
  };

  const handleDniChange = (e) => {
    const value = e.target.value;
    setDni(value);
    setButtonDisabled(value.length !== 8);
  };

  const handleTelefonoChange = (e) => {
    if (e.target.value.length <= 9) {
      setTelefono(e.target.value);
    }
  };

  const obtenerFechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const año = hoy.getFullYear();
    return `${año}-${mes}-${dia}`;
  };

  useEffect(() => {
    setFechaContratacion(obtenerFechaActual()); // Establecer fecha actual al cargar el componente
  }, []);

  const guardar = async (e) => {
    e.preventDefault();

    if (dni.length !== 8) {
      toast.error('El DNI debe tener exactamente 8 dígitos.');
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      toast.error('El correo electrónico no es válido.');
      return;
    }

    try {
      await axios.post(URI, { dni, nombre_completo, direccion, telefono, email, fecha_contratacion });
      toast.success('Empleado registrado con éxito');
      navigate('/empleados');
    } catch (error) {
      toast.error('Error al crear el empleado');
      console.error('Error al crear el empleado:', error);
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
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-primary d-flex align-items-center gap-2"
                      onClick={obtenerDatosReniec}
                      disabled={buttonDisabled || loading}
                    >
                      <i className="fa-solid fa-address-card"></i> Consultar Persona
                      {loading && (
                        <l-ring-2
                          size="30"
                          color="white"
                          stroke="5"
                          speed="0.8"
                          stroke-length="0.25"
                        ></l-ring-2>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    value={nombre_completo}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    type="text"
                    className="form-control"
                    readOnly={isReadOnly}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
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