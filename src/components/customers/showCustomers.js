import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de Bootstrap
import { toast } from 'react-toastify';  // Importar toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/clientes/';

const CompShowCustomers = () => {
    const [clientes, setClientes] = useState([]); // Inicializar como array vacío
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(10); // Clientes por página
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
    const [selectedCliente, setSelectedCliente] = useState(null); // Cliente seleccionado para eliminar

    useEffect(() => {
        getClientes();
    }, []);

    const getClientes = async () => {
        try {
            const res = await axios.get(URI);
            if (Array.isArray(res.data)) {
                setClientes(res.data);
            } else {
                setClientes([]);
                console.error("La respuesta no es un array", res.data);
            }
        } catch (error) {
            console.error("Error al obtener los clientes", error);
            setClientes([]);
        }
    };

    const deleteCliente = async (id) => {
        try {
            await axios.delete(`${URI}${id}`);
            getClientes(); // Refresca la lista de clientes
            toast.success('Cliente eliminado con éxito');  // Mostrar notificación de éxito
        } catch (error) {
            toast.error('Error al eliminar el cliente');
            console.error("Error al eliminar el cliente", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleShowModal = (cliente) => {
        setSelectedCliente(cliente);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedCliente) {
            await deleteCliente(selectedCliente.id);
            setShowModal(false);
        }
    };

    // Filtrar clientes basado en búsqueda por nombre, apellido o DNI
    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.dni.includes(searchTerm) // Añade esta línea para permitir la búsqueda por DNI
    );

    // Obtener los clientes actuales para la página
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredClientes.slice(indexOfFirstCustomer, indexOfLastCustomer);

    // Cambiar de página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/clientes/create" className='btn btn-primary add-button'>
                    + Agregar Cliente
                </Link>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Direccion</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Sexo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.dni}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.direccion}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.fecha_nacimiento}</td>
                            <td>{cliente.sexo}</td>
                            <td>
                                <Link to={`/clientes/edit/${cliente.id}`} className='btn btn-info'>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </Link>
                                <button
                                    onClick={() => handleShowModal(cliente)}
                                    className='btn btn-danger'>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {[...Array(Math.ceil(filteredClientes.length / customersPerPage)).keys()].map(number => (
                    <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
                        {number + 1}
                    </button>
                ))}
            </div>

            {/* Modal de confirmación para eliminar */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensaje de confirmación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Seguro que quieres eliminar este cliente?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>
                        Sí, Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CompShowCustomers;
