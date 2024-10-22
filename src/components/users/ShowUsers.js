import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap'; // Importar componentes de Bootstrap
import CompEditUser from './EditUsers'; // Importar el componente que se usará como modal
import ChangePasswordModal from './changePassword'; // Importar modal de cambiar contraseña
import { Link } from 'react-router-dom'; // Importar Link para la navegación
import { toast } from 'react-toastify';  // Importar toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify
import { FaKey } from 'react-icons/fa';  // Importar el ícono de llave
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/usuarios/';

const CompShowUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [UsuariosPerPage] = useState(10); // Usuarios por página
    const [showEditModal, setShowEditModal] = useState(false); // Control del modal de edición
    const [showPasswordModal, setShowPasswordModal] = useState(false); // Control del modal de cambiar contraseña
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal de confirmación de eliminar
    const [selectedUserId, setSelectedUserId] = useState(null); // ID del usuario seleccionado para editar
    const [selectedDeleteUserId, setSelectedDeleteUserId] = useState(null); // ID del usuario seleccionado para eliminar

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

    const deleteUsuario = async () => {
        try {
            await axios.delete(`${URI}${selectedDeleteUserId}`);
            getUsuarios();
            toast.success('Usuario eliminado con éxito');  // Mostrar notificación de éxito
            setShowDeleteModal(false); // Ocultar el modal de eliminación
        } catch (error) {
            toast.error('Error al eliminar el usuario'); 
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUsuarios = currentPage * UsuariosPerPage;
    const indexOfFirstUsuarios = indexOfLastUsuarios - UsuariosPerPage;
    const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuarios, indexOfLastUsuarios);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleEditClick = (userId) => {
        setSelectedUserId(userId); // Establecer el ID del usuario seleccionado
        setShowEditModal(true); // Mostrar el modal de edición
    };

    const handlePasswordChangeClick = (userId) => {
        setSelectedUserId(userId); // Establecer el ID del usuario seleccionado para cambiar contraseña
        setShowPasswordModal(true); // Mostrar el modal de cambiar contraseña
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false); // Ocultar el modal de edición
        setSelectedUserId(null); // Restablecer el ID seleccionado
        getUsuarios(); // Refrescar los datos después de la actualización
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false); // Ocultar el modal de cambiar contraseña
        setSelectedUserId(null); // Restablecer el ID seleccionado
    };

    const handleShowDeleteModal = (userId) => {
        setSelectedDeleteUserId(userId);
        setShowDeleteModal(true); // Mostrar el modal de confirmación para eliminar
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteConfirmed = () => {
        deleteUsuario();
    };

    return (
        <div className='container'>
            <div className='table-header d-flex justify-content-between align-items-center'>
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
                        <th>Rol</th>
                        <th>Empleado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nombre_usuario}</td>
                            <td>{usuario.rol}</td>
                            <td>{usuario.empleado?.nombre_empleado || 'No asignado'}</td>
                            <td>
                                <Button
                                    className="btn btn-info mx-1"
                                    onClick={() => handleEditClick(usuario.id)}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </Button>
                                <Button
                                    className="btn btn-warning mx-1"
                                    onClick={() => handlePasswordChangeClick(usuario.id)}
                                >
                                    <FaKey /> {/* Ícono de llave */}
                                </Button>
                                <Button
                                    className="btn btn-danger mx-1"
                                    onClick={() => handleShowDeleteModal(usuario.id)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </Button>
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
                            className={currentPage === number + 1 ? 'active' : ''}
                        >
                            {number + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Modal para editar el usuario */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Rol del Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUserId && (
                        <CompEditUser userId={selectedUserId} onClose={handleCloseEditModal} />
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal de cambio de contraseña */}
            <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUserId && (
                        <ChangePasswordModal userId={selectedUserId} onClose={handleClosePasswordModal} />
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal de confirmación para eliminar */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensaje de confirmación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Seguro que quieres eliminar este usuario?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>
                        Sí, Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompShowUsers;
