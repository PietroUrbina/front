import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Estilos para toastify

const URI = 'http://localhost:8000/productos/';
const CATEGORIAS_URI = 'http://localhost:8000/categorias/';

const CompEditProduct = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [id_categoria, setIdCategoria] = useState('');
  const [precio_compra, setPrecioCompra] = useState('');
  const [precio_venta, setPrecioVenta] = useState('');
  const [fecha_vencimiento, setFechaVencimiento] = useState('');
  const [imagen, setImagen] = useState('');
  const [categorias, setCategorias] = useState([]);

  const obtenerCategorias = useCallback(async () => {
    try {
      const response = await axios.get(CATEGORIAS_URI);
      setCategorias(response.data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
      console.error('Error al cargar las categorías:', error);
    }
  }, []);

  const obtenerProducto = useCallback(async () => {
    try {
      const response = await axios.get(`${URI}${id}`);
      const producto = response.data;
      setNombre(producto.nombre_producto);
      setDescripcion(producto.descripcion);
      setIdCategoria(producto.id_categoria || '');
      setPrecioCompra(producto.precio_compra);
      setPrecioVenta(producto.precio_venta);
      setFechaVencimiento(producto.fecha_vencimiento || '');
      setImagen(producto.imagen);
    } catch (error) {
      toast.error('Error al cargar el producto');
      console.error('Error al cargar el producto:', error);
    }
  }, [id]);

  useEffect(() => {
    obtenerCategorias();
    obtenerProducto();
  }, [obtenerCategorias, obtenerProducto]);

  const actualizarProducto = async (e) => {
    e.preventDefault();

    const productoData = {
      nombre_producto: nombre,
      descripcion,
      id_categoria,
      precio_compra,
      precio_venta,
      fecha_vencimiento: fecha_vencimiento || null, // Si no hay fecha, enviar null
      imagen,
    };

    try {
      await axios.put(`${URI}${id}`, productoData);
      toast.success('Producto actualizado con éxito');
      navigate('/productos');
    } catch (error) {
      toast.error('Error al actualizar el producto');
      console.error('Error al actualizar el producto:', error);
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
              <h3>Editar Producto</h3>
            </div>
            <div className="card-body">
              <form onSubmit={actualizarProducto}>
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
                  <label className="form-label">Costo</label>
                  <input
                    value={precio_compra}
                    onChange={(e) => setPrecioCompra(e.target.value)}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    value={precio_venta}
                    onChange={(e) => setPrecioVenta(e.target.value)}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Vencimiento (opcional)</label>
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
                  />
                </div>
                <div className="form-group text-center">
                  <button type="submit" className="btn btn-primary mr-4 mx-4">
                    Guardar
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

export default CompEditProduct;
