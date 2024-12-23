import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KardexModal from '../kardex/showKardex';
import GlobalKardexModal from '../kardex/ShowKardexGlobal';
import '../../assets/styles/mainTables.scss';

const URI_INVENTARIOS = 'http://localhost:8000/inventarios';
const URI_KARDEX = 'http://localhost:8000/kardex';

const CompShowInventory = () => {
    const [inventarios, setInventarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [InventarioPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedInventario, setSelectedInventario] = useState(null);
    const [kardexData, setKardexData] = useState([]);
    const [precioInventario, setPrecioInventario] = useState(0);
    const [nombreProducto, setNombreProducto] = useState(''); // Nuevo estado para el nombre del producto
    const [showKardexModal, setShowKardexModal] = useState(false);
    const [showGlobalKardexModal, setShowGlobalKardexModal] = useState(false);

    useEffect(() => {
        getInventarios();
    }, []);

    // Obtener inventarios desde el backend
    const getInventarios = async () => {
        try {
            const res = await axios.get(URI_INVENTARIOS);
            if (res.status === 200 && Array.isArray(res.data)) {
                setInventarios(res.data);
            } else {
                toast.error('No se encontraron inventarios disponibles.');
            }
        } catch (error) {
            toast.error('Error al obtener los inventarios. Verifique el servidor.');
            console.error('Error al cargar inventarios:', error);
        }
    };

    // Obtener Kardex de un producto específico
    const getKardex = async (id_inventario, productoNombre) => {
        try {
            const res = await axios.get(`${URI_KARDEX}/${id_inventario}`);
            if (res.status === 200) {
                setKardexData(res.data.movimientos);
                setPrecioInventario(res.data.precio);
                setNombreProducto(productoNombre); // Actualiza el nombre del producto
                setShowKardexModal(true);
            } else {
                toast.error('No se encontraron movimientos en el Kardex para este inventario.');
            }
        } catch (error) {
            toast.error('Error al obtener movimientos del Kardex.');
            console.error('Error al obtener el Kardex:', error);
        }
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'Sin fecha';
        return new Date(fecha).toLocaleString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredInventarios = inventarios.filter((inventario) =>
        inventario.producto?.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastInventario = currentPage * InventarioPerPage;
    const indexOfFirstInventario = indexOfLastInventario - InventarioPerPage;
    const currentInventarios = filteredInventarios.slice(indexOfFirstInventario, indexOfLastInventario);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStockClass = (stock) => (stock > 30 ? 'high' : stock >= 10 ? 'medium' : 'low');
    const getEstadoClass = (stock) => (stock > 0 ? 'activo' : 'inactivo');

    const handleShowModal = (inventario) => {
        setSelectedInventario(inventario);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleDeleteConfirmed = async () => {
        if (selectedInventario) {
            try {
                await axios.delete(`${URI_INVENTARIOS}/${selectedInventario.id}`);
                getInventarios();
                setShowModal(false);
                toast.success('Inventario eliminado con éxito');
            } catch (error) {
                toast.error('Error al eliminar el inventario');
                console.error('Error al eliminar el inventario:', error);
            }
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Inventarios', 20, 10);
        doc.autoTable({
            head: [
                ['Producto', 'Stock', 'Precio', 'Unidad de Medida', 'Fecha Vencimiento', 'Fecha Actualización', 'Estado']
            ],
            body: inventarios.map((inventario) => [
                inventario.producto?.nombre_producto || 'Producto no encontrado',
                inventario.stock,
                `S/${parseFloat(inventario.precio || 0).toFixed(2)}`,
                inventario.unidad_medida?.nombre_unidad || 'N/A',
                inventario.producto?.fecha_vencimiento?.split('T')[0] || 'Sin fecha',
                formatFecha(inventario.fecha_actualizacion),
                inventario.stock > 0 ? 'Activo' : 'Inactivo',
            ]),
        });
        doc.save('reporte_inventarios.pdf');
    };     

    return (
        <div className="container">
            <div className="table-header">
                <Link to="/inventarios/create" className="add-button">
                    <i className="fa fa-plus"></i> Agregar Inventario
                </Link>
                <div className="search-container">
                    <Button onClick={() => setShowGlobalKardexModal(true)} className="btn btn-info">
                        <i className="fa fa-solid fa-right-left"></i>
                    </Button>
                    <Button onClick={generatePDF} className="btn btn-secondary" title="Generar reporte">
                        <i className="fa fa-print"></i>
                    </Button>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar inventario..."
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
                            <th>Unidad de Medida</th>
                            <th>Fecha Vencimiento</th>
                            <th>Movimiento</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInventarios.map((inventario) => (
                            <tr key={inventario.id}>
                                <td>{inventario.producto?.nombre_producto || 'Producto no encontrado'}</td>
                                <td>
                                    <span className={`chip stock ${getStockClass(inventario.stock)}`}>
                                        {inventario.stock}
                                    </span>
                                </td>
                                <td>S/{parseFloat(inventario.precio || 0).toFixed(2)}</td>
                                <td>{inventario.unidad_medida?.nombre_unidad || 'N/A'}</td>
                                <td>{inventario.producto?.fecha_vencimiento || 'Sin fecha'}</td>
                                <td>{formatFecha(inventario.fecha_actualizacion)}</td>
                                <td>
                                    <span className={`chip estado ${getEstadoClass(inventario.stock)}`}>
                                        {getEstadoClass(inventario.stock) === 'activo' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            getKardex(inventario.id, inventario.producto?.nombre_producto)
                                        }
                                        className="btn btn-warning"
                                    >
                                        <i className="fa fa-solid fa-right-left"></i>
                                    </button>
                                    <Link to={`/inventarios/edit/${inventario.id}`} className="btn btn-info">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                    <button
                                        onClick={() => handleShowModal(inventario)}
                                        className="btn btn-danger"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredInventarios.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredInventarios.length / InventarioPerPage)).keys()].map((number) => (
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensaje de confirmación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Seguro que quieres eliminar este producto del inventario?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>
                        Sí, Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            <KardexModal
                show={showKardexModal}
                onHide={() => setShowKardexModal(false)}
                kardexData={kardexData}
                precioInventario={precioInventario}
                nombreProducto={nombreProducto}
            />

            <GlobalKardexModal
                show={showGlobalKardexModal}
                onHide={() => setShowGlobalKardexModal(false)}
            />
        </div>
    );
};

export default CompShowInventory;