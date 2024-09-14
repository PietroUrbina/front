import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/usuarios/';

const CompCreateUser = () => {
  const [nombre_usuario, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('');
  const navigate = useNavigate();

  // Roles definidos en el modelo de la base de datos
  const roles = ['administrador', 'cajero', 'mozo'];

  // Procedimiento para guardar el nuevo usuario
  const guardar = async (e) => {
    e.preventDefault(); // Corregido
    await axios.post(URI, { nombre_usuario, contrasena, rol });
    navigate('/usuarios');
  };
  // Función para manejar el evento de cancelación
  const cancelar = () => {
    navigate('/usuarios'); // Redirige al usuario a la lista de clientes
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