import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:8000/productos/';
const CATEGORIAS_URI = 'http://localhost:8000/categorias/'; // URI para obtener las categorías

const CompEditProduct = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [id_categoria, setIdCategoria] = useState('');
    const [precio, setPrecio] = useState('');
    const [fecha_vencimiento, setFechaVencimiento] = useState('');
    const [imagen, setImagen] = useState('');
    const [categorias, setCategorias] = useState([]); // Estado para las categorías
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL

    // Cargar los datos del producto por ID y cargar las categorías
    useEffect(() => {
        const getProductById = async () => {
            try {
                const res = await axios.get(`${URI}${id}`);
                if (res.data) {
                    setNombre(res.data.nombre || '');
                    setDescripcion(res.data.descripcion || '');
                    setIdCategoria(res.data.id_categoria || '');
                    setPrecio(res.data.precio || '');
                    setImagen(res.data.imagen || '');
                    setFechaVencimiento(res.data.fecha_vencimiento ? res.data.fecha_vencimiento.split('T')[0] : '');
                }
            } catch (error) {
                console.error("Error al obtener los datos del Producto:", error);
            }
        };

        const getCategorias = async () => {
            try {
                const res = await axios.get(CATEGORIAS_URI);
                setCategorias(res.data); // Suponiendo que la respuesta es un array de categorías
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };

        getProductById();
        getCategorias();
    }, [id]);

    // Procedimiento para actualizar el Producto
    const actualizar = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URI}${id}`, {
                nombre,
                descripcion,
                id_categoria,
                precio,
                fecha_vencimiento: fecha_vencimiento || null, // Envía null si no hay fecha
                imagen
            });
            navigate('/productos');
        } catch (error) {
            console.error("Error al actualizar el Producto:", error);
        }
    };

    const cancelar = () => {
        navigate('/productos'); 
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Editar y Actualizar Producto</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={actualizar}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del Producto</label>
                                    <input
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Categoría</label>
                                    <select
                                        value={id_categoria}
                                        onChange={(e) => setIdCategoria(e.target.value)}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.nombre_categoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Precio</label>
                                    <input
                                        value={precio}
                                        onChange={(e) => setPrecio(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Vencimiento (Opcional)</label>
                                    <input
                                        value={fecha_vencimiento || ''}
                                        onChange={(e) => setFechaVencimiento(e.target.value)}
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">URL de Imagen</label>
                                    <input
                                        value={imagen}
                                        onChange={(e) => setImagen(e.target.value)}
                                        type="text"
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

export default CompEditProduct;
