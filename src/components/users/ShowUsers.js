import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import CompEditUser from './EditUsers';
import ChangePasswordModal from './changePassword';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaKey } from 'react-icons/fa';
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/usuarios/';

const CompShowUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [UsuariosPerPage] = useState(10);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedDeleteUserId, setSelectedDeleteUserId] = useState(null);

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
            toast.success('Usuario eliminado con éxito');
            setShowDeleteModal(false);
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
        usuario.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUsuarios = currentPage * UsuariosPerPage;
    const indexOfFirstUsuarios = indexOfLastUsuarios - UsuariosPerPage;
    const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuarios, indexOfLastUsuarios);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleEditClick = (userId) => {
        setSelectedUserId(userId);
        setShowEditModal(true);
    };

    const handlePasswordChangeClick = (userId) => {
        setSelectedUserId(userId);
        setShowPasswordModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedUserId(null);
        getUsuarios();
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setSelectedUserId(null);
    };

    const handleShowDeleteModal = (userId) => {
        setSelectedDeleteUserId(userId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteConfirmed = () => {
        deleteUsuario();
    };

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/usuarios/create" className='add-button'>
                    <i className="fa fa-plus"></i> Agregar Usuario
                </Link>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar Usuarios..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Contenedor independiente para habilitar el scroll solo en la tabla */}
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Empleado</th>
                            <th>Nombre de Usuario</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.empleado?.nombre_completo || 'No asignado'}</td>
                                <td>{usuario.nombre_usuario}</td>
                                <td>{usuario.rol}</td>
                                <td>
                                    <div className="actions">
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
                                            <FaKey />
                                        </Button>
                                        <Button
                                            className="btn btn-danger mx-1"
                                            onClick={() => handleShowDeleteModal(usuario.id)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
