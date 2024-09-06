import axios from 'axios';
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
// import {Link} from 'react-router-dom';

const URI = 'http://localhost:8000/usuarios/'

const CompShowUsers = () => {
    const [usuarios, setUsuario] = useState([])
    
    useEffect(() => {
        getUsuarios()
    }, [])

    // procedimiento para mostrar todos los Usuarios
    const getUsuarios = async () => {
        const res = await axios.get(URI)
        console.log(res.data) // Verifica si los datos están llegando correctamente
        setUsuario(res.data)
    }

    // procedimiento para eliminar un Usuario
    const deleteUsuario = async (id) => {
        await axios.delete(`${URI}${id}`)
        getUsuarios()
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <Link to="/create" className='btn btn-primary mt-2 mb-2'><i className="fa-solid fa-plus"></i></Link>
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Contraseña</th>
                                <th>Rol</th>
                                <th>Acciones</th>    
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nombre_usuario}</td>
                                    <td>{usuario.contraseña}</td>
                                    <td>{usuario.rol}</td>
                                    <td>
                                        <Link to={`/edit/${usuario.id}`} className='btn btn-info'><i className="fa-solid fa-pen-to-square"></i></Link> 
                                        <button onClick={() => deleteUsuario(usuario.id)} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button>
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

export default CompShowUsers
