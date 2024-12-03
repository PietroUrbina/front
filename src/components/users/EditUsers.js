import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URI = 'http://localhost:8000/usuarios/';

const CompEditUser = ({ userId, onClose }) => {
  const [nombreUsuario, setNombreUsuario] = useState(''); // Estado para el nombre de usuario
  const [rol, setRol] = useState('');
  const [roles] = useState([
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Cajero', label: 'Cajero' },
    { value: 'Mozo', label: 'Mozo' }
  ]);

  // Función para obtener el usuario por ID
  const getUsuarioById = useCallback(async () => {
    try {
      const res = await axios.get(`${URI}${userId}`);
      const userData = res.data;
      setNombreUsuario(userData.nombre_usuario); // Setear el nombre de usuario
      setRol(userData.rol);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      toast.error('Error al cargar los datos del usuario');
    }
  }, [userId]);

  useEffect(() => {
    getUsuarioById();
  }, [getUsuarioById]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${URI}${userId}`, { nombre_usuario: nombreUsuario, rol }); // Añadir nombre_usuario
      toast.success('Usuario actualizado con éxito');
      onClose(); // Cerrar el modal y actualizar la lista
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      toast.error('Error al actualizar el usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nombre de Usuario</label>
        <input
          type="text"
          className="form-control"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Rol</label>
        <Select
          options={roles}
          value={roles.find(option => option.value === rol)}
          onChange={(selectedOption) => setRol(selectedOption?.value)}
          placeholder="Selecciona un rol"
          required
        />
      </div>
      <div className="form-group text-center">
        <button type="submit" className="btn btn-primary mr-4 mx-4">Guardar</button>
        <button type="button" className="btn btn-danger" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default CompEditUser;
