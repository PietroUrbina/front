import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de Bootstrap
import jsPDF from 'jspdf'; // Importar jsPDF para generar PDF
import 'jspdf-autotable'; // Importamos jsPDF autotable para generar tablas en el PDF
import { toast } from 'react-toastify';  // Importar toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/productos/';

const CompShowProducts = () => {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10); // Productos por página
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
    const [selectedProducto, setSelectedProducto] = useState(null); // Producto seleccionado para eliminar

    useEffect(() => {
        getProductos();
    }, []);

    const getProductos = async () => {
        try {
            const res = await axios.get(URI);
            setProductos(res.data);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };

    const deleteProducto = async (id) => {
        try {
            await axios.delete(`${URI}${id}`);
            getProductos(); // Recargar los productos después de la eliminación exitosa
            toast.success('Producto eliminado con éxito');  // Mostrar notificación de éxito
        } catch (error) {
            toast.error('Error al eliminar el producto');
            console.error("Error al eliminar el producto:", error.response?.data || error.message);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Restablece a la primera página para reflejar los resultados de la búsqueda desde el inicio
    };

    const handleShowModal = (producto) => {
        setSelectedProducto(producto);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedProducto) {
            await deleteProducto(selectedProducto.id);
            setShowModal(false);
        }
    };

    // Función para generar el PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Productos", 20, 10);

        // Generamos la tabla en el PDF
        doc.autoTable({
            head: [['Nombre', 'Descripcion', 'Categoria', 'Costo', 'Fecha de Vencimiento', 'Estado']],
            body: productos.map(producto => [
                producto.nombre,
                producto.descripcion,
                producto.categoria ? producto.categoria.nombre_categoria : 'Sin Categoría',
                producto.costo,
                producto.fecha_vencimiento,
                producto.estado === 'activo' ? 'Activo' : 'Inactivo'
            ])
        });

        // Guardamos el PDF
        doc.save('reporte_productos.pdf');
    };

    // Filtrar productos antes de la paginación
    const filteredProducts = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación después de filtrar
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Cambiar de página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Función para determinar la clase del estado (activo/inactivo)
    const getEstadoClass = (estado) => {
        return estado === 'activo' ? 'activo' : 'inactivo';
    };

    return (
        <div className='container'>
            <div className='table-header d-flex justify-content-between align-items-center'>
                <Link to="/productos/create" className='btn btn-primary add-button'>
                    + Agregar Producto
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
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Categoria</th>
                        <th>Costo</th>
                        <th>Fecha de Vencimiento</th>
                        <th>Imagen</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {currentProducts.map(producto => (
                    <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion}</td>
                        <td>{producto.categoria ? producto.categoria.nombre_categoria : 'Sin Categoría'}</td>
                        <td>{producto.costo}</td>
                        <td>{producto.fecha_vencimiento}</td>
                        <td>
                            <img 
                                src={producto.imagen} 
                                alt={producto.nombre} 
                                style={{ width: '100px', height: 'auto' }}
                            />
                        </td>
                        <td>
                            <span className={`chip estado ${getEstadoClass(producto.estado)}`}>
                                {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td>
                            <Link to={`/productos/edit/${producto.id}`} className='btn btn-info'>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                            <button
                                onClick={() => handleShowModal(producto)}
                                className='btn btn-danger'
                                disabled={producto.estado === 'activo'}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(number => (
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
                <Modal.Body>¿Seguro que quieres eliminar este producto?</Modal.Body>
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

export default CompShowProducts;
