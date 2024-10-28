import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URI = 'http://localhost:8000/categorias/';

const CompEditCategorias = () => {
    const [nombre_categoria, setNombreCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getCategoriaById = async () => {
            try {
                console.log(`Fetching data for categoria ID: ${id}`);
                const res = await axios.get(`${URI}${id}`);

                // Validar si la respuesta contiene datos correctos
                if (res.data && res.data.nombre_categoria && res.data.descripcion) {
                    console.log("Datos recibidos:", res.data);
                    setNombreCategoria(res.data.nombre_categoria);
                    setDescripcion(res.data.descripcion);
                } else {
                    console.warn("No se encontraron datos para la categoría con el ID especificado");
                    toast.warn("No se encontraron datos para la categoría.");
                }
            } catch (error) {
                console.error("Error al obtener los datos de la categoría:", error);
                const errorMsg = error.response
                    ? `Error ${error.response.status}: ${error.response.data.message}`
                    : 'Error de conexión al servidor';
                toast.error(errorMsg);
            } finally {
                setLoading(false);  // Asegurarse de desactivar la carga
            }
        };

        getCategoriaById();
    }, [id]);

    const actualizar = async (e) => {
        e.preventDefault();
        setLoading(true);  // Bloquear el botón mientras se actualiza
        try {
            console.log(`Actualizando categoría ID: ${id}`);
            await axios.put(`${URI}${id}`, {
                nombre_categoria,
                descripcion
            });
            toast.success('Categoría actualizada con éxito');
            navigate('/categorias');
        } catch (error) {
            console.error("Error al actualizar la categoría:", error);
            const errorMsg = error.response
                ? `Error ${error.response.status}: ${error.response.data.message}`
                : 'Error de conexión al servidor';
            toast.error(errorMsg);
        } finally {
            setLoading(false);  // Asegurarse de desactivar la carga después de intentar actualizar
        }
    };

    const cancelar = () => {
        navigate('/categorias');
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Editar y Actualizar la Categoría</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={actualizar}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de la Categoría</label>
                                    <input
                                        value={nombre_categoria}
                                        onChange={(e) => setNombreCategoria(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                        disabled={loading}  // Deshabilitar input si loading está activo
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <input
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                        disabled={loading}  // Deshabilitar input si loading está activo
                                    />
                                </div>
                                <div className="form-group text-center">
                                    <button type="submit" className="btn btn-primary mr-4 mx-4" disabled={loading}>
                                        {loading ? 'Guardando...' : 'Guardar'}
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={cancelar}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompEditCategorias;
