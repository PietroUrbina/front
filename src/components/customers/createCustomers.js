import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/clientes/';
const RENIEC_URI = 'http://localhost:8000/clientes/reniec'; // Asegúrate de que la ruta es correcta

const CompCreateCustomers = () => {
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha_nacimiento, setFechaNacimiento] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const navigate = useNavigate();

  const obtenerDatosReniec = async () => {
    try {
      const response = await axios.post(RENIEC_URI, { dni });
      if (response.data) {
        setNombre(response.data.nombreCompleto);
        setApellido(response.data.apellidosCompletos);
        setIsReadOnly(true); // Hace los campos Nombre y Apellido de solo lectura
      }
    } catch (error) {
      console.error('Error al obtener datos de la RENIEC', error);
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

  const guardar = async (e) => {
    e.preventDefault();
    e.preventDefault();
    // Añadir validación antes de enviar
    if (dni.length !== 8) {
      alert('El DNI debe tener exactamente 8 dígitos.');
      return;
    }
    if (telefono && telefono.length < 9) {
      alert('El teléfono debe tener hasta 9 dígitos.');
      return;
    }

    try {
      await axios.post(URI, { dni, nombre, apellido, email, telefono, fecha_nacimiento });
      navigate('/clientes');
    } catch (error) {
      console.error('Error al crear cliente', error);
    }
  };
  // Función para manejar el evento de cancelación
  const cancelar = () => {
    navigate('/clientes'); // Redirige al usuario a la lista de clientes
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Crear un Nuevo Cliente</h3>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                <div className="mb-3">
                  <label className="form-label">DNI del Cliente</label>
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
                    Ver Persona
                  </button>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombres del Cliente</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    className="form-control"
                    readOnly={isReadOnly}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellidos del Cliente</label>
                  <input
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    type="text"
                    className="form-control"
                    readOnly={isReadOnly}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Nacimiento</label>
                  <input
                    value={fecha_nacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    type="date"
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

export default CompCreateCustomers;
