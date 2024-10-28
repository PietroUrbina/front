import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/inventarios/';

const CompShowInventories = () => {
    const [inventarios, setInventarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [InventarioPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedInventario, setSelectedInventario] = useState(null);

    useEffect(() => {
        getInventario();
    }, []);

    const getInventario = async () => {
        try {
            const res = await axios.get(URI);
            setInventarios(res.data);
        } catch (error) {
            console.error("Error al obtener los inventarios:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredInventario = inventarios.filter(inventario => {
        return inventario.producto?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const indexOfLastInventario = currentPage * InventarioPerPage;
    const indexOfFirstInventario = indexOfLastInventario - InventarioPerPage;
    const currentInventario = filteredInventario.slice(indexOfFirstInventario, indexOfLastInventario);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const getStockClass = (stock) => {
        return stock > 30 ? 'high' : stock >= 10 ? 'medium' : 'low';
    };

    const getEstadoClass = (stock) => {
        return stock > 0 ? 'activo' : 'inactivo';
    };

    const handleShowModal = (inventario) => {
        setSelectedInventario(inventario);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedInventario) {
            try {
                await axios.delete(`${URI}${selectedInventario.id}`);
                getInventario();
                setShowModal(false);
                toast.success('Inventario eliminado con éxito');
            } catch (error) {
                toast.error('Error al eliminar el inventario');
                console.error("Error al eliminar el inventario:", error);
            }
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Inventario", 20, 10);
        doc.autoTable({
            head: [['Producto', 'Stock', 'Precio', 'Unidad de Medida', 'Movimiento', 'Fecha de Movimiento', 'Estado']],
            body: inventarios.map(inventario => [
                inventario.producto?.nombre || 'Producto no encontrado',
                inventario.stock,
                inventario.precio,
                inventario.unidad_medida,
                inventario.tipo_movimiento,
                inventario.fecha_movimiento,
                inventario.stock > 0 ? 'Activo' : 'Inactivo'
            ])
        });
        doc.save('reporte_inventario.pdf');
    };

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/inventarios/create" className='add-button'>
                    <i className="fa fa-plus"></i> Agregar Inventario
                </Link>
                <div className="search-container">
                    <Button onClick={generatePDF} className='btn btn-secondary' title="Generar reporte">
                        <i className="fa fa-print"></i>
                    </Button>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar Inventario de..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Tipo de Medida</th>
                            <th>Movimiento</th>
                            <th>Fecha de Movimiento</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInventario.map((inventario) => (
                            <tr key={inventario.id}>
                                <td>{inventario.producto ? inventario.producto.nombre : 'Producto no encontrado'}</td>
                                <td><span className={`chip stock ${getStockClass(inventario.stock)}`}>{inventario.stock}</span></td>
                                <td>S/{inventario.precio}</td>
                                <td>{inventario.unidad_medida}</td>
                                <td>{inventario.tipo_movimiento}</td>
                                <td>{inventario.fecha_movimiento}</td>
                                <td><span className={`chip estado ${getEstadoClass(inventario.stock)}`}>{getEstadoClass(inventario.stock) === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
                                <td>
                                    <Link to={`/inventarios/edit/${inventario.id}`} className="btn btn-info">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                    <button onClick={() => handleShowModal(inventario)} className="btn btn-danger">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredInventario.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredInventario.length / InventarioPerPage)).keys()].map(number => (
                        <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
                            {number + 1}
                        </button>
                    ))}
                </div>
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensaje de confirmación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Seguro que quieres eliminar el inventario?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>Sí, Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CompShowInventories;
