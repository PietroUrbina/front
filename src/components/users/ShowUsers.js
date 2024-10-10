import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/mainTables.scss'; 

const URI = 'http://localhost:8000/usuarios/';

const CompShowUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [UsuariosPerPage] = useState(10); // Usuarios por página

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        try {
            const res = await axios.get(URI);
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    const deleteUsuarios = async (id) => {
        try {
            await axios.delete(`${URI}${id}`);
            getUsuarios();
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Restablece a la primera página para reflejar los resultados de la búsqueda desde el inicio
    };

    // Filtrar usuarios antes de la paginación
    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación después de filtrar
    const indexOfLastUsuarios = currentPage * UsuariosPerPage;
    const indexOfFirstUsuarios = indexOfLastUsuarios - UsuariosPerPage;
    const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuarios, indexOfLastUsuarios);

    // Cambiar de página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/usuarios/create" className='btn btn-primary add-button'>
                    + Agregar Usuario
                </Link>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar Usuarios..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre de Usuario</th>
                        <th>contraseña</th>
                        <th>Rol</th>
                        <th>Empleado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {currentUsuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre_usuario}</td>
                    <td>{usuario.contrasena}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.empleado?.nombre_empleado || 'No asignado'}</td>  {/* Evitar espacios innecesarios */}
                    <td>
                      <Link to={`/usuarios/edit/${usuario.id}`} className="btn btn-info">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                      <button onClick={() => deleteUsuarios(usuario.id)} className="btn btn-danger">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsuarios.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredUsuarios.length / UsuariosPerPage)).keys()].map(number => (
                        <button 
                            key={number + 1} 
                            onClick={() => paginate(number + 1)} 
                            className={currentPage === number + 1 ? 'active' : ''}>
                            {number + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CompShowUsers;
