import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/mainTables.scss'; // Asegúrate de que esta ruta es correcta

const URI = 'http://localhost:8000/box/';

const CompShowBox = () => {
    const [boxes, setBoxes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [boxesPerPage] = useState(10); // Boxes por página

    useEffect(() => {
        getBoxes();
    }, []);

    const getBoxes = async () => {
        const res = await axios.get(URI);
        setBoxes(res.data);
    };

    const deleteBox = async (id) => {
        await axios.delete(`${URI}${id}`);
        getBoxes();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtrar boxes según término de búsqueda
    const filteredBoxes = boxes.filter(box =>
        box.nombre_box.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const indexOfLastBox = currentPage * boxesPerPage;
    const indexOfFirstBox = indexOfLastBox - boxesPerPage;
    const currentBoxes = filteredBoxes.slice(indexOfFirstBox, indexOfLastBox);

    // Cambiar página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/box/create" className='btn btn-primary add-button'>
                    + Agregar Box
                </Link>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar boxes..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre del Box</th>
                        <th>Capacidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentBoxes.map((box) => (
                        <tr key={box.id}>
                            <td>{box.nombre_box}</td>
                            <td>{box.capacidad}</td>
                            <td>
                                <Link to={`/box/edit/${box.id}`} className='btn btn-info'>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </Link> 
                                <button onClick={() => deleteBox(box.id)} className='btn btn-danger'>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {[...Array(Math.ceil(filteredBoxes.length / boxesPerPage)).keys()].map(number => (
                    <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CompShowBox;
