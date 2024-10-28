import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/categorias/';

const CompShowCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriasPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null);

    useEffect(() => {
        getCategorias();
    }, []);

    const getCategorias = async () => {
        try {
            const res = await axios.get(URI);
            setCategorias(res.data);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
        }
    };

    const deleteCategoria = async (id) => {
        try {
            await axios.delete(`${URI}${id}`);
            toast.success('Categoría eliminada con éxito');
            getCategorias();
        } catch (error) {
            toast.error('Error al eliminar la categoría');
            console.error("Error al eliminar la categoría:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleShowModal = (categoria) => {
        setSelectedCategoria(categoria);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedCategoria) {
            await deleteCategoria(selectedCategoria.id);
            setShowModal(false);
        }
    };

    const filteredCategorias = categorias.filter(categoria =>
        categoria.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCategoria = currentPage * categoriasPerPage;
    const indexOfFirstCategoria = indexOfLastCategoria - categoriasPerPage;
    const currentCategorias = filteredCategorias.slice(indexOfFirstCategoria, indexOfLastCategoria);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/categorias/create" className='add-button'>
                    <i className="fa fa-plus"></i> Agregar Categoría
                </Link>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar categorías..."
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
                            <th>Nombre de la Categoría</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.nombre_categoria}</td>
                                <td>{categoria.descripcion}</td>
                                <td>
                                    <div className="actions">
                                        <Link to={`/categorias/edit/${categoria.id}`} className='btn btn-info mx-1'>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                        <button 
                                            onClick={() => handleShowModal(categoria)} 
                                            className='btn btn-danger mx-1'>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredCategorias.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredCategorias.length / categoriasPerPage)).keys()].map((number) => (
                        <button 
                            key={`page-${number + 1}`} 
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
                <Modal.Body>¿Seguro que quieres eliminar esta categoría?</Modal.Body>
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
};

export default CompShowCategorias;
