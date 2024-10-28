import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/clientes/';

const CompShowCustomers = () => {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);

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
            getClientes();
            toast.success('Cliente eliminado con éxito');
        } catch (error) {
            toast.error('Error al eliminar el cliente');
            console.error("Error al eliminar el cliente", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
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

    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.dni.includes(searchTerm)
    );

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredClientes.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/clientes/create" className='add-button'>
                    <i className="fa fa-plus"></i> Agregar Cliente
                </Link>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar clientes..."
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
            </div>

            {filteredClientes.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredClientes.length / customersPerPage)).keys()].map(number => (
                        <button 
                            key={number + 1} 
                            onClick={() => paginate(number + 1)} 
                            className={currentPage === number + 1 ? 'active' : ''}>
                            {number + 1}
                        </button>
                    ))}
                </div>
            )}

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
    );
}

export default CompShowCustomers;
