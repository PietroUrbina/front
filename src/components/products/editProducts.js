import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:8000/productos/'; // Cambié 'usuarios' por 'productos'

const CompEditProduct = () => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [fecha_vencimiento, setFechaVencimiento] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL

    useEffect(() => {
        // Obtener los datos del producto por ID
        const getProductById = async () => {
            try {
                const res = await axios.get(`${URI}${id}`);
                if (res.data) {
                    setNombre(res.data.nombre || '');
                    setPrecio(res.data.precio || '');
                    setStock(res.data.stock || '');
                    // Si hay fecha de vencimiento, formatear correctamente
                    setFechaVencimiento(res.data.fecha_vencimiento ? res.data.fecha_vencimiento.split('T')[0] : '');
                }
            } catch (error) {
                console.error("Error al obtener los datos del Producto:", error);
            }
        };

        getProductById();
    }, [id]); // Solo 'id' como dependencia

    // Procedimiento para actualizar
    const actualizar = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URI}${id}`, {
                nombre,
                precio,
                stock,
                // Si no se especifica la fecha, enviar null al backend
                fecha_vencimiento: fecha_vencimiento || null
            });
            navigate('/');
        } catch (error) {
            console.error("Error al actualizar el Producto:", error);
        }
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
                                    <label className="form-label">Stock</label>
                                    <input
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Vencimiento (Opcional)</label>
                                    <input
                                        value={fecha_vencimiento ? fecha_vencimiento.split('T')[0] : ''}
                                        onChange={(e) => setFechaVencimiento(e.target.value)}
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Guardar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompEditProduct;
