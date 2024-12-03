import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/empleados/';

const CompShowEmployees = () => {
    const [empleados, setEmpleados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [EmpleadosPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);

    useEffect(() => {
        getEmpleados();
    }, []);

    const getEmpleados = async () => {
        try {
            const res = await axios.get(URI);
            setEmpleados(res.data);
        } catch (error) {
            console.error("Error al obtener los empleados:", error);
        }
    };

    const deleteEmpleado = async (id) => {
        try {
            await axios.delete(`${URI}${id}`);
            getEmpleados();
            toast.success('Empleado eliminado con éxito');
        } catch (error) {
            toast.error('Error al eliminar el empleado');
            console.error("Error al eliminar el empleado:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleShowModal = (empleado) => {
        setSelectedEmpleado(empleado);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedEmpleado) {
            await deleteEmpleado(selectedEmpleado.id);
            setShowModal(false);
        }
    };

    const filteredEmpleados = empleados.filter(empleado =>
        empleado.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastEmpleados = currentPage * EmpleadosPerPage;
    const indexOfFirstEmpleados = indexOfLastEmpleados - EmpleadosPerPage;
    const currentEmpleados = filteredEmpleados.slice(indexOfFirstEmpleados, indexOfLastEmpleados);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/empleados/create" className='add-button'>
                    <i className="fa fa-plus"></i> Agregar Empleado
                </Link>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar Empleados..."
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
                            <th>Nombres Completo</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Fecha de Contratación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmpleados.map((empleado) => (
                            <tr key={empleado.id}>
                                <td>{empleado.dni}</td>
                                <td>{empleado.nombre_completo}</td>
                                <td>{empleado.direccion}</td>
                                <td>{empleado.telefono}</td>
                                <td>{empleado.email}</td>
                                <td>{empleado.fecha_contratacion}</td>
                                <td>
                                    <Link to={`/empleados/edit/${empleado.id}`} className='btn btn-info'>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                    <button 
                                        onClick={() => handleShowModal(empleado)} 
                                        className='btn btn-danger'>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredEmpleados.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredEmpleados.length / EmpleadosPerPage)).keys()].map(number => (
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
                <Modal.Body>¿Seguro que quieres eliminar este empleado?</Modal.Body>
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

export default CompShowEmployees;
