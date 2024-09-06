import axios from 'axios';
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
// import {Link} from 'react-router-dom';

const URI = 'http://localhost:8000/productos/'

const CompShowProducts = () => {
    const [productos, setProductos] = useState([])
    
    useEffect(() => {
        getProductos()
    }, [])

    // procedimiento para mostrar todos los Usuarios
    const getProductos = async () => {
        const res = await axios.get(URI)
        console.log(res.data) // Verifica si los datos están llegando correctamente
        setProductos(res.data)
    }

    // procedimiento para eliminar un Usuario
    const deleteProducto = async (id) => {
        await axios.delete(`${URI}${id}`)
        getProductos()
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <Link to="/create" className='btn btn-primary mt-2 mb-2'><i className="fa-solid fa-plus"></i></Link>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Fecha de Vencimiento</th>
                                <th>Acciones</th>    
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.precio}</td>
                                    <td>{producto.stock}</td>
                                    <td>{producto.fecha_vencimiento}</td>
                                    <td>
                                        <Link to={`/edit/${producto.id}`} className='btn btn-info'><i className="fa-solid fa-pen-to-square"></i></Link> 
                                        <button onClick={() => deleteProducto(producto.id)} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CompShowProducts
