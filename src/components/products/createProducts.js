import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify

const URI = 'http://localhost:8000/productos/';
const CATEGORIAS_URI = 'http://localhost:8000/categorias/'; // URI para obtener las categorías

const CompCreateProducts = () => {
  const [nombre_producto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [id_categoria, setIdCategoria] = useState('');
  const [precio_compra, setPrecioCompra] = useState('');
  const [precio_venta, setPrecioVenta] = useState('');
  const [fecha_vencimiento, setFechaVencimiento] = useState(null);
  const [imagen, setImagen] = useState('');
  const [categorias, setCategorias] = useState([]); // Estado para las categorías
  const navigate = useNavigate();

  // Cargar categorías cuando el componente se monta
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await axios.get(CATEGORIAS_URI);
        setCategorias(response.data); 
      } catch (error) {
        toast.error('Error al cargar las categorías');
        console.error('Error al cargar las categorías:', error);
      }
    };

    obtenerCategorias();
  }, []);

  // Procedimiento para guardar el nuevo Producto
  const guardar = async (e) => {
    e.preventDefault();
  
    if (!id_categoria) {
      toast.error('Debe seleccionar una categoría.');
      return;
    }
  
    const productoData = {
      nombre_producto,
      descripcion,
      id_categoria,
      precio_compra,
      precio_venta,
      fecha_vencimiento: fecha_vencimiento || null,
      imagen: imagen || null
    };
  
    console.log('Datos enviados al backend:', productoData); // Verifica el contenido
  
    try {
      await axios.post(URI, productoData);
      toast.success('Producto registrado con éxito');
      navigate('/productos');
    } catch (error) {
      toast.error('Error al crear el producto');
      console.error('Error al crear el producto:', error.response?.data || error.message);
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
              <h3>Crear un Nuevo Producto</h3>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Producto</label>
                  <input
                    value={nombre_producto}
                    onChange={(e) => setNombreProducto(e.target.value)}
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
                    onChange={(e) => setIdCategoria(Number(e.target.value))}
                    className="form-control"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.length > 0 ? (
                      categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre_categoria} {/* Ajuste según el modelo */}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Cargando categorías...
                      </option>
                    )}
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
};

export default CompCreateProducts;
