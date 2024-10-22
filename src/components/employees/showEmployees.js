import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de Bootstrap
import { toast } from 'react-toastify';  // Importar toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify
import '../../assets/styles/mainTables.scss'; 

const URI = 'http://localhost:8000/empleados/';

const CompShowEmployees = () => {
    const [empleados, setEmpleados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [EmpleadosPerPage] = useState(10); // Empleados por página
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
    const [selectedEmpleado, setSelectedEmpleado] = useState(null); // Empleado seleccionado para eliminar

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
            toast.success('Empleado eliminado con éxito');  // Mostrar notificación de éxito
        } catch (error) {
            toast.error('Error al eliminar el empleado');
            console.error("Error al eliminar el empleado:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Restablece a la primera página para reflejar los resultados de la búsqueda desde el inicio
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

    // Filtrar empleados antes de la paginación
    const filteredEmpleados = empleados.filter(empleado =>
        empleado.nombre_empleado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación después de filtrar
    const indexOfLastEmpleados = currentPage * EmpleadosPerPage;
    const indexOfFirstEmpleados = indexOfLastEmpleados - EmpleadosPerPage;
    const currentEmpleados = filteredEmpleados.slice(indexOfFirstEmpleados, indexOfLastEmpleados);

    // Cambiar de página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/empleados/create" className='btn btn-primary add-button'>
                    + Agregar Empleado
                </Link>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar Empleados..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Dni</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Email</th>
                        <th>Fecha de Contratacion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmpleados.map((empleado) => (
                        <tr key={empleado.id}>
                            <td>{empleado.dni}</td>
                            <td>{empleado.nombre_empleado}</td>
                            <td>{empleado.apellido_empleado}</td>
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

            {/* Modal de confirmación para eliminar */}
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
