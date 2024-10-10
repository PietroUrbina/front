import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/mainTables.scss'; 

const URI = 'http://localhost:8000/empleados/';

const CompShowEmployees = () => {
    const [empleados, setEmpleados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [EmpleadosPerPage] = useState(10); // Empleados por página

    useEffect(() => {
        getEmpleados();
    }, []);

    const getEmpleados = async () => {
        try {
            const res = await axios.get(URI);
            setEmpleados(res.data);
        } catch (error) {
            console.error("Error al obtener los empleados:", error);
        }
    };

    const deleteEmpleados = async (id) => {
        try {
            await axios.delete(`${URI}${id}`);
            getEmpleados();
        } catch (error) {
            console.error("Error al eliminar el empleado:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Restablece a la primera página para reflejar los resultados de la búsqueda desde el inicio
    };

    // Filtrar empleados antes de la paginación
    const filteredEmpleados = empleados.filter(empleado =>
        empleado.nombre_empleado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación después de filtrar
    const indexOfLastEmpleados = currentPage * EmpleadosPerPage;
    const indexOfFirstEmpleados = indexOfLastEmpleados - EmpleadosPerPage;
    const currentEmpleados = filteredEmpleados.slice(indexOfFirstEmpleados, indexOfLastEmpleados);

    // Cambiar de página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/empleados/create" className='btn btn-primary add-button'>
                    + Agregar Empleado
                </Link>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar Empleados..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Email</th>
                        <th>Fecha de Contratacion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmpleados.map((empleado) => (
                        <tr key={empleado.id}>
                            <td>{empleado.nombre_empleado}</td>
                            <td>{empleado.direccion}</td>
                            <td>{empleado.telefono}</td>
                            <td>{empleado.email}</td>
                            <td>{empleado.fecha_contratacion}</td>
                            <td>
                                <Link to={`/empleados/edit/${empleado.id}`} className='btn btn-info'>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </Link>
                                <button onClick={() => deleteEmpleados(empleado.id)} className='btn btn-danger'>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredEmpleados.length > 0 && (
                <div className="pagination">
                    {[...Array(Math.ceil(filteredEmpleados.length / EmpleadosPerPage)).keys()].map(number => (
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

export default CompShowEmployees;
