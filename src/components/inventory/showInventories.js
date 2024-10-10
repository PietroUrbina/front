import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/mainTables.scss'; 

const URI = 'http://localhost:8000/inventarios/';

const CompShowInventories = () => {
    const [inventarios, setInventarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [InventarioPerPage] = useState(10); // Inventarios por página

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

    const deleteInventario = async (id) => {
        try {
            await axios.delete(`${URI}${id}`);
            getInventario();
        } catch (error) {
            console.error("Error al eliminar el inventario:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Restablece a la primera página para reflejar los resultados de la búsqueda desde el inicio
    };

    const filteredInventario = inventarios.filter(inventario => {
        console.log(inventario.id_producto); // Verificar el valor aquí
        return inventario.id_producto?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
    

    // Paginación después de filtrar
    const indexOfLastInventario = currentPage * InventarioPerPage;
    const indexOfFirstInventario = indexOfLastInventario - InventarioPerPage;
    const currentInventario = filteredInventario.slice(indexOfFirstInventario, indexOfLastInventario);

    // Cambiar de página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/inventarios/create" className='btn btn-primary add-button'>
                    + Agregar Inventario
                </Link>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar Inventario de..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Movimiento</th>
                        <th>Stock</th>
                        <th>Medida</th>
                        <th>Fecha de Movimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {currentInventario.map((inventario) => (
                  <tr key={inventario.id}>
                    <td>{inventario.id_producto}</td>
                    <td>{inventario.tipo_movimiento}</td>
                    <td>{inventario.stock}</td>
                    <td>{inventario.unidad_medida}</td>
                    <td>{inventario.fecha_movimiento}</td>
                    <td>
                      <Link to={`/inventarios/edit/${inventario.id}`} className="btn btn-info">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                      <button onClick={() => deleteInventario(inventario.id)} className="btn btn-danger">
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
        </div>
    )
}

export default CompShowInventories ;
