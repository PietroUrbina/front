import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:8000/box/';

const CompEditBox = () => {
    const [nombre_box, setNombreBox] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL

    useEffect(() => {
        // Definir la función dentro de useEffect para evitar dependencias innecesarias
        const getBoxBlogId = async () => {
            try {
                const res = await axios.get(`${URI}${id}`);
                if (res.data) {
                    setNombreBox(res.data.nombre_box || '');
                    setCapacidad(res.data.capacidad || '');
                }
            } catch (error) {
                console.error("Error al obtener los datos del box:", error);
            }
        };

        getBoxBlogId();
    }, [id]); // Solo 'id' como dependencia

    // Procedimiento para actualizar
    const actualizar = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URI}${id}`, {
                nombre_box,
                capacidad
            });
            navigate('/box');
        } catch (error) {
            console.error("Error al actualizar el box:", error);
        }
    };

    const cancelar = () => {
        navigate('/box'); 
      };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Editar y Actualizar el Box</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={actualizar}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del box</label>
                                    <input
                                        value={nombre_box}
                                        onChange={(e) => setNombreBox(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Capacidad</label>
                                    <input
                                        value={capacidad}
                                        onChange={(e) => setCapacidad(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group text-center">
                                <button type="submit" className="btn btn-primary mr-4 mx-4">Guardar</button>
                                <button type="button" className="btn btn-danger" onClick={cancelar}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompEditBox;
