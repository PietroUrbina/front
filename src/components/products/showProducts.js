import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/mainTables.scss'; // Asegúrate de que esta ruta es correcta

const URI = 'http://localhost:8000/productos/';

const CompShowProducts = () => {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10); // Productos por página

    useEffect(() => {
        getProductos();
    }, []);

    const getProductos = async () => {
        const res = await axios.get(URI);
        setProductos(res.data);
    };

    const deleteProducto = async (id) => {
        await axios.delete(`${URI}${id}`);
        getProductos();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Restablece a la primera página para reflejar los resultados de la búsqueda desde el inicio
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

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/productos/create" className='btn btn-primary add-button'>
                    + Agregar Producto
                </Link>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Categoria</th>
                        <th>Precio</th>
                        <th>Fecha de Vencimiento</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {currentProducts.map(producto => (
                    <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion}</td>
                        <td>{producto.categoria ? producto.categoria.nombre_categoria : 'Sin Categoría'}</td>
                        <td>{producto.precio}</td>
                        <td>{producto.fecha_vencimiento}</td>
                        <td>
                            <img 
                                src={producto.imagen} 
                                alt={producto.nombre} 
                                style={{ width: '100px', height: 'auto' }}
                            />
                           
                        </td>
                        <td>
                            <Link to={`/productos/edit/${producto.id}`} className='btn btn-info'>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                            <button onClick={() => deleteProducto(producto.id)} className='btn btn-danger'>
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
        </div>
    )
}

export default CompShowProducts;
