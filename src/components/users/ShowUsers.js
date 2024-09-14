import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/mainTables.scss'; // Asegúrate de que esta ruta es correcta

const URI = 'http://localhost:8000/usuarios/';

const CompShowUsers = () => {
  const [usuarios, setUsuario] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Usuarios por página

  useEffect(() => {
    getUsuarios();
  }, []);

  const getUsuarios = async () => {
    const res = await axios.get(URI);
    setUsuario(res.data);
  };

  const deleteUsuario = async (id) => {
    await axios.delete(`${URI}${id}`);
    getUsuarios();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener los usuarios actuales
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

  // Cambiar página
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="table-header">
        <Link to="/usuarios/create" className="btn btn-primary add-button">
          + Agregar Usuario
        </Link>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>USUARIO</th>
            <th>CONTRASEÑA</th>
            <th>ROL</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.contrasena}</td>
              <td>{usuario.rol}</td>
              <td>
                <Link to={`/usuarios/edit/${usuario.id}`} className="btn btn-info">
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                <button
                  onClick={() => deleteUsuario(usuario.id)}
                  className="btn btn-danger"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(Math.ceil(filteredUsuarios.length / usersPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)}>
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompShowUsers;
