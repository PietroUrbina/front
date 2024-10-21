import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de Bootstrap
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importamos jsPDF autotable para generar tablas en el PDF
import { toast } from 'react-toastify';  // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/inventarios/';

const CompShowInventories = () => {
    const [inventarios, setInventarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [InventarioPerPage] = useState(10); // Inventarios por página
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
    const [selectedInventario, setSelectedInventario] = useState(null); // Inventario seleccionado para eliminar

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
        setCurrentPage(1); // Restablece a la primera página para reflejar los resultados de la búsqueda desde el inicio
    };

    const filteredInventario = inventarios.filter(inventario => {
        return inventario.producto?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Paginación después de filtrar
    const indexOfLastInventario = currentPage * InventarioPerPage;
    const indexOfFirstInventario = indexOfLastInventario - InventarioPerPage;
    const currentInventario = filteredInventario.slice(indexOfFirstInventario, indexOfLastInventario);

    // Cambiar de página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Función para determinar la clase del color del stock
    const getStockClass = (stock) => {
        if (stock > 30) {
            return 'high'; // Stock alto
        } else if (stock <= 30 && stock >= 10) {
            return 'medium'; // Stock medio
        } else {
            return 'low'; // Stock bajo
        }
    };

    // Función para determinar el estado (Activo/Inactivo)
    const getEstadoClass = (stock) => {
        return stock > 0 ? 'activo' : 'inactivo';
    };

    // Mostrar el modal de confirmación
    const handleShowModal = (inventario) => {
        setSelectedInventario(inventario);
        setShowModal(true);
    };

    // Ocultar el modal de confirmación
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Eliminar el inventario después de confirmar
    const handleDeleteConfirmed = async () => {
        if (selectedInventario) {
            try {
                await axios.delete(`${URI}${selectedInventario.id}`);
                getInventario();
                setShowModal(false);
                toast.success('Inventario eliminado con éxito');  // Mostrar notificación de éxito
            } catch (error) {
                toast.error('Error al eliminar el inventario');
                console.error("Error al eliminar el inventario:", error);
            }
        }
    };

    // Función para generar el PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Inventario", 20, 10);

        // Generamos la tabla en el PDF
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

        // Guardamos el PDF
        doc.save('reporte_inventario.pdf');
    };

    return (
        <div className='container'>
            <div className='table-header d-flex justify-content-between align-items-center'>
                <Link to="/inventarios/create" className='btn btn-primary add-button'>
                    <i className="fa fa-plus"></i> Agregar Inventario
                </Link>
                <div className="d-flex align-items-center">
                    {/* Botón para generar PDF con tooltip */}
                    <Button
                        onClick={generatePDF}
                        className='btn btn-secondary ml-2'
                        title="Generar reporte"  // Tooltip
                    >
                        <i className="fa fa-print"></i> {/* Ícono de impresión */}
                    </Button>
                    <input
                        type="text"
                        className="search-input ml-2"
                        placeholder="Buscar Inventario de..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
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

                            {/* Mostrar stock con el estilo de "chip" */}
                            <td>
                                <span className={`chip stock ${getStockClass(inventario.stock)}`}>
                                    {inventario.stock}
                                </span>
                            </td>

                            <td>{inventario.precio}</td>
                            <td>{inventario.unidad_medida}</td>
                            <td>{inventario.tipo_movimiento}</td>
                            <td>{inventario.fecha_movimiento}</td>

                            {/* Mostrar el estado como "chip" */}
                            <td>
                                <span className={`chip estado ${getEstadoClass(inventario.stock)}`}>
                                    {getEstadoClass(inventario.stock) === 'activo' ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>

                            <td>
                                <Link to={`/inventarios/edit/${inventario.id}`} className="btn btn-info">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </Link>
                                <button 
                                    onClick={() => handleShowModal(inventario)} 
                                    className="btn btn-danger">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredInventario.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredInventario.length / InventarioPerPage)).keys()].map(number => (
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
                <Modal.Body>¿Seguro que quieres eliminar el inventario?</Modal.Body>
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

export default CompShowInventories;
