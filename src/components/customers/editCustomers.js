import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ring2 } from 'ldrs'; // Importar el loader
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ring2.register(); // Registrar el loader

const URI = 'http://localhost:8000/clientes/';

const CompEditCustomer = () => {
  const { id } = useParams(); // Obtener el ID del cliente desde la URL
  const [dni, setDni] = useState('');
  const [nombre_completo, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el loader
  const navigate = useNavigate();

  // Cargar los datos del cliente al iniciar
  useEffect(() => {
    const getCustomerById = async () => {
      setLoading(true); // Mostrar el loader
      try {
        const response = await axios.get(`${URI}${id}`);
        if (response.data) {
          setDni(response.data.dni);
          setNombreCompleto(response.data.nombre_completo);
          setDireccion(response.data.direccion);
          setEmail(response.data.email);
          setTelefono(response.data.telefono);
        } else {
          toast.error('No se encontraron datos para este cliente.');
        }
      } catch (error) {
        toast.error('Error al cargar los datos del cliente.');
        console.error('Error al cargar los datos del cliente:', error);
      } finally {
        setLoading(false); // Ocultar el loader
      }
    };

    getCustomerById();
  }, [id]);

  const handleTelefonoChange = (e) => {
    if (e.target.value.length <= 9) {
      setTelefono(e.target.value);
    }
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      toast.error('El correo electrónico no es válido.');
      return;
    }

    try {
      await axios.put(`${URI}${id}`, { direccion, email, telefono });
      toast.success('Cliente actualizado con éxito.');
      navigate('/clientes');
    } catch (error) {
      toast.error('Error al actualizar el cliente.');
      console.error('Error al actualizar cliente:', error);
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
              <h3>Editar Cliente</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loader-container text-center mt-3">
                  <l-ring-2 size="40" color="#007bff" speed="0.9"></l-ring-2>
                </div>
              ) : (
                <form onSubmit={guardar}>
                  <div className="mb-3">
                    <label className="form-label">DNI del Cliente</label>
                    <input
                      value={dni}
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre Completo</label>
                    <input
                      value={nombre_completo}
                      type="text"
                      className="form-control"
                      readOnly
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompEditCustomer;
