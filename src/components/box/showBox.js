import axios from 'axios';
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

// Definir la URI para tu API
const URI = 'http://localhost:8000/box/'

const CompShowBox = () => {
    // Estado para almacenar los boxes
    const [boxes, setBoxes] = useState([])

    useEffect(() => {
        getBoxes()
    }, [])

    // Procedimiento para obtener todos los boxes
    const getBoxes = async () => {
        try {
            const res = await axios.get(URI)
            console.log(res.data) // Verifica si los datos están llegando correctamente
            setBoxes(res.data)
        } catch (error) {
            console.error('Error al obtener los boxes:', error);
        }
    }

    // Procedimiento para eliminar un Box
    const deleteBox = async (id) => {
        try {
            await axios.delete(`${URI}${id}`)
            getBoxes()
        } catch (error) {
            console.error('Error al eliminar el box:', error);
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <Link to="/create" className='btn btn-primary mt-2 mb-2'>
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Nombre del Box</th>
                                <th>Capacidad</th>
                                <th>Acciones</th>    
                            </tr>
                        </thead>
                        <tbody>
                            {boxes.map((box) => (
                                <tr key={box.id}>
                                    <td>{box.nombre_box}</td>
                                    <td>{box.capacidad}</td>
                                    <td>
                                        <Link to={`/edit/${box.id}`} className='btn btn-info'>
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
                </div>
            </div>
        </div>
    )
}

export default CompShowBox
