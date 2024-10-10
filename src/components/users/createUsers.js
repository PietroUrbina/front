import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/usuarios/';
const URI_EMPLEADOS = 'http://localhost:8000/empleados/'; // URI para obtener los empleados

const CompCreateUser = () => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('');
  const [id_empleado, setIdEmpleado] = useState('');  // El valor correcto que es el ID del empleado
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar los empleados
  const navigate = useNavigate();

  // Roles definidos en el modelo de la base de datos
  const roles = ['administrador', 'cajero', 'mozo'];

  // Obtener los empleados al cargar el componente
  useEffect(() => {
    getEmpleados();
  }, []);

  const getEmpleados = async () => {
    try {
      const res = await axios.get(URI_EMPLEADOS);
      setEmpleados(res.data); // Asumimos que res.data es un array de empleados
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // Procedimiento para guardar el nuevo usuario
  const guardar = async (e) => {
    e.preventDefault();

    // Verifica que los datos sean correctos antes de enviarlos
    console.log({
      nombre_usuario,
      contrasena,
      rol,
      id_empleado  // Aquí debería ser el ID del empleado, no su nombre
    });

    try {
      await axios.post(URI, { nombre_usuario, contrasena, rol, id_empleado });
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    }
  };

  // Función para manejar el evento de cancelación
  const cancelar = () => {
    navigate('/usuarios'); 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Crear un Nuevo Usuario</h3>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                <div className="mb-3">
                  <label className="form-label">Nombre de Usuario</label>
                  <input
                    value={nombre_usuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
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
                  <div className="mb-3">
                  <label className="form-label">Empleado</label>
                    <select
                    value={id_empleado}
                    onChange={(e) => setIdEmpleado(e.target.value)}  // Usamos el ID del empleado
                    className="form-select"
                    required
                    >
                <option value="">Selecciona un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>
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
};

export default CompCreateUser;
