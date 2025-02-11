import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/box/';

const CompShowBox = () => {
    const [boxes, setBoxes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [boxesPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedBox, setSelectedBox] = useState(null);

    useEffect(() => {
        getBoxes();
    }, []);

    const getBoxes = async () => {
        try {
            const res = await axios.get(URI);
            setBoxes(res.data);
        } catch (error) {
            console.error("Error al obtener los boxes:", error);
        }
    };

    const deleteBox = async (id) => {
        try {
            await axios.delete(`${URI}${id}`);
            getBoxes();
            toast.success('Box eliminado con éxito');
        } catch (error) {
            toast.error('Error al eliminar el box');
            console.error("Error al eliminar el box:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleShowModal = (box) => {
        setSelectedBox(box);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedBox) {
            await deleteBox(selectedBox.id);
            setShowModal(false);
        }
    };

    const filteredBoxes = boxes.filter(box =>
        box.nombre_box.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastBox = currentPage * boxesPerPage;
    const indexOfFirstBox = indexOfLastBox - boxesPerPage;
    const currentBoxes = filteredBoxes.slice(indexOfFirstBox, indexOfLastBox);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/box/create" className='add-button'>
                    <i className="fa fa-plus"></i> Agregar Box
                </Link>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar boxes..."
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
                            <th>Nombre del Box</th>
                            <th>Capacidad</th>
                            <th>Requisitos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBoxes.map((box) => (
                            <tr key={box.id}>
                                <td>{box.nombre_box}</td>
                                <td>{box.capacidad}</td>
                                <td>{box.requisitos}</td>
                                <td>
                                    <Link to={`/box/edit/${box.id}`} className='btn btn-info'>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                    <button 
                                        onClick={() => handleShowModal(box)} 
                                        className='btn btn-danger'>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredBoxes.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredBoxes.length / boxesPerPage)).keys()].map(number => (
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
                <Modal.Body>¿Seguro que quieres eliminar este box?</Modal.Body>
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

export default CompShowBox;
