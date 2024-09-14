import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/mainTables.scss'; // Asegúrate de que esta ruta es correcta

const URI = 'http://localhost:8000/clientes/';

const CompShowCustomers = () => {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(10); // Clientes por página

    useEffect(() => {
        getClientes();
    }, []);

    const getClientes = async () => {
        const res = await axios.get(URI);
        setClientes(res.data);
    };

    const deleteCliente = async (id) => {
        await axios.delete(`${URI}${id}`);
        getClientes();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtrar clientes basado en búsqueda por nombre, apellido o DNI
    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.dni.includes(searchTerm) // Añade esta línea para permitir la búsqueda por DNI
    );

    // Obtener los clientes actuales para la página
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredClientes.slice(indexOfFirstCustomer, indexOfLastCustomer);

    // Cambiar de página
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='table-header'>
                <Link to="/clientes/create" className='btn btn-primary add-button'>
                    + Agregar Cliente
                </Link>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.dni}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.fecha_nacimiento}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                            <td>
                                <Link to={`/clientes/edit/${cliente.id}`} className='btn btn-info'><i className="fa-solid fa-pen-to-square"></i></Link>
                                <button onClick={() => deleteCliente(cliente.id)} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {[...Array(Math.ceil(filteredClientes.length / customersPerPage)).keys()].map(number => (
                    <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CompShowCustomers;