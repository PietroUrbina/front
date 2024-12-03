import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ring2 } from 'ldrs'; // Importar el loader
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

ring2.register(); // Registrar el loader

const URI = 'http://localhost:8000/clientes/';
const RENIEC_URI = 'http://localhost:8000/clientes/reniec';

const CompCreateCustomers = () => {
  const [dni, setDni] = useState('');
  const [nombre_completo, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el loader
  const navigate = useNavigate();

  const obtenerDatosReniec = async () => {
    setLoading(true); // Mostrar el loader
    try {
      const response = await axios.post(RENIEC_URI, { dni });
      if (response.data) {
        setNombreCompleto(response.data.nombreCompleto);
        setIsReadOnly(true);
        toast.success('Datos obtenidos correctamente');
      } else {
        setIsReadOnly(false);
        toast.error('No se encontraron datos para este DNI');
      }
    } catch (error) {
      setIsReadOnly(false);
      toast.error('Error al obtener datos de la RENIEC');
      console.error('Error al obtener datos de la RENIEC', error);
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
      await axios.post(URI, { dni, nombre_completo, direccion, email, telefono });
      toast.success('Cliente creado con éxito');
      navigate('/clientes');
    } catch (error) {
      toast.error('Error al crear el cliente');
      console.error('Error al crear cliente', error);
    }
  };

  const cancelar = () => {
    navigate('/clientes');
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
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="form-control"
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
