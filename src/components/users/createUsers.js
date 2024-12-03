import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Importar react-select
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Íconos de ojo
import { toast } from 'react-toastify';  // Importar toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify

const URI = 'http://localhost:8000/usuarios/';
const URI_EMPLEADOS = 'http://localhost:8000/empleados/';

const CompCreateUser = () => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repiteContrasena, setRepiteContrasena] = useState('');
  const [rol, setRol] = useState('');
  const [id_empleado, setIdEmpleado] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState({
    nombre_usuario: '',
    contrasena: '',
    repiteContrasena: '',
    nombreExistente: ''
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarRepiteContrasena, setMostrarRepiteContrasena] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Cajero', label: 'Cajero' },
    { value: 'Mozo', label: 'Mozo' }
  ];

  useEffect(() => {
    getEmpleados();
  }, []);

  const getEmpleados = async () => {
    try {
      const res = await axios.get(URI_EMPLEADOS);
      const empleadosOptions = res.data.map(empleado => ({
        value: empleado.id,
        label: empleado.nombre_completo
      }));
      setEmpleados(empleadosOptions);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  const checkNombreUsuario = async (nombre_usuario) => {
    try {
      const res = await axios.post(`${URI}check-usuario`, { nombre_usuario });
      if (res.status === 200) {
        setError((prev) => ({ ...prev, nombre_usuario: '' }));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError((prev) => ({ ...prev, nombre_usuario: error.response.data.message }));
      } else {
        console.error('Error al verificar el nombre de usuario:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (nombre_usuario.length < 8) {
      setError(prev => ({ ...prev, nombre_usuario: 'El nombre de usuario debe tener al menos 8 caracteres.' }));
      return;
    }

    if (contrasena.length < 10) {
      setError(prev => ({ ...prev, contrasena: 'La contraseña debe tener al menos 10 caracteres.' }));
      return;
    }

    if (contrasena !== repiteContrasena) {
      setError(prev => ({ ...prev, repiteContrasena: 'Las contraseñas no coinciden.' }));
      return;
    }

    try {
      const res = await axios.post(URI, { nombre_usuario, contrasena, rol, id_empleado });
      console.log('Usuario creado con éxito:', res.data);
      toast.success('Usuario creado con éxito');
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al crear el usuario:', error.response || error);
    }
  };

  useEffect(() => {
    if (nombre_usuario.length >= 4) {
      checkNombreUsuario(nombre_usuario);
    }
  }, [nombre_usuario]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Crear un Nuevo Usuario</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
              <div className="mb-3">
                  <label className="form-label">Empleado</label>
                  <Select
                    options={empleados}
                    value={empleados.find(option => option.value === id_empleado)}
                    onChange={(selectedOption) => setIdEmpleado(selectedOption?.value)}
                    placeholder="Selecciona un empleado"
                    isClearable
                    isSearchable
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre de Usuario</label>
                  <input
                    value={nombre_usuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    type="text"
                    className={`form-control ${error.nombre_usuario ? 'is-invalid' : ''}`}
                    required
                  />
                  {error.nombre_usuario && (
                    <div className="invalid-feedback">
                      {error.nombre_usuario}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <div className="input-group">
                    <input
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      type={mostrarContrasena ? "text" : "password"}
                      className={`form-control ${error.contrasena ? 'is-invalid' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    >
                      {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {error.contrasena && (
                    <div className="invalid-feedback d-block"> {/* Aseguramos que el mensaje se muestre */}
                      {error.contrasena}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Repite la Contraseña</label>
                  <div className="input-group">
                    <input
                      value={repiteContrasena}
                      onChange={(e) => setRepiteContrasena(e.target.value)}
                      type={mostrarRepiteContrasena ? "text" : "password"}
                      className={`form-control ${error.repiteContrasena ? 'is-invalid' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setMostrarRepiteContrasena(!mostrarRepiteContrasena)}
                    >
                      {mostrarRepiteContrasena ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {error.repiteContrasena && (
                    <div className="invalid-feedback d-block">
                      {error.repiteContrasena}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Rol</label>
                  <Select
                    options={roles}
                    value={roles.find(option => option.value === rol)}
                    onChange={(selectedOption) => setRol(selectedOption?.value)}
                    placeholder="Selecciona un rol"
                    isClearable
                    isSearchable
                    required
                  />
                </div>
                <div className="form-group text-center">
                  <button type="submit" className="btn btn-primary mr-4 mx-4">Guardar</button>
                  <button type="button" className="btn btn-danger" onClick={() => navigate('/usuarios')}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompCreateUser;
