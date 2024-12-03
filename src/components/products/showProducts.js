import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/mainTables.scss';

const URI = 'http://localhost:8000/productos/';

const CompShowProducts = () => {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);

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
            getProductos();
            toast.success('Producto eliminado con éxito');
        } catch (error) {
            toast.error('Error al eliminar el producto');
            console.error("Error al eliminar el producto:", error.response?.data || error.message);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
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

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Productos", 20, 10);

        doc.autoTable({
            head: [['Nombre', 'Descripcion', 'Categoria', 'Costo', 'Fecha de Vencimiento', 'Estado']],
            body: productos.map(producto => [
                producto.nombre_producto,
                producto.descripcion,
                producto.categoria ? producto.categoria.nombre_categoria : 'Sin Categoría',
                producto.costo,
                producto.fecha_vencimiento || 'No tiene',
                producto.estado === 'activo' ? 'Activo' : 'Inactivo'
            ])
        });

        doc.save('reporte_productos.pdf');
    };

    const filteredProducts = productos.filter(producto =>
        producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const getEstadoClass = (estado) => {
        return estado === 'activo' ? 'activo' : 'inactivo';
    };

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/productos/create" className='add-button'>
                    <i className="fa fa-plus"></i> Agregar Producto
                </Link>
                <div className="search-container">
                    <Button
                        onClick={generatePDF}
                        className='btn btn-secondary'
                        title="Generar reporte"
                    >
                        <i className="fa fa-print"></i>
                    </Button>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar productos..."
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
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Categoria</th>
                            <th>Costo</th>
                            <th>Precio</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Imagen</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentProducts.map(producto => (
                        <tr key={producto.id}>
                            <td>{producto.nombre_producto}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.categoria ? producto.categoria.nombre_categoria : 'Sin Categoría'}</td>
                            <td>S/{producto.precio_compra}</td>
                            <td>S/{producto.precio_venta}</td>
                            <td>{producto.fecha_vencimiento || 'No tiene'}</td>
                            <td>
                                <img 
                                    src={producto.imagen} 
                                    alt={producto.nombre_producto} 
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
            </div>

            {filteredProducts.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(number => (
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
