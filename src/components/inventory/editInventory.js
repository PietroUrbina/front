import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';  // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify
import Select from 'react-select';

// URIs para los productos e inventarios
const URI_INVENTARIOS = 'http://localhost:8000/inventarios/';
const URI_PRODUCTOS = 'http://localhost:8000/productos/';

const CompEditInventories = () => {
  const { id } = useParams();  // Obtener el ID de la URL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tipo_movimiento, setTipoMovimiento] = useState('');
  const [stock, setStock] = useState('');
  const [precio, setPrecio] = useState('');
  const [unidad_medida, setUnidadMedida] = useState('');
  const [fecha_movimiento, setFechaMovimiento] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos
  const navigate = useNavigate();

  // Obtener los productos al cargar el componente
  useEffect(() => {
    getProductos();
    if (id) {
      getInventarioById(id);  // Cargar el inventario para edición
    }
  }, [id]);

  // Obtener todos los productos
  const getProductos = async () => {
    try {
      const res = await axios.get(URI_PRODUCTOS);
      const options = res.data.map(producto => ({
        value: producto.id,
        label: producto.nombre,
        categoria: producto.categoria?.nombre_categoria || 'Sin categoría',
        costo: producto.costo,
        fecha_vencimiento: producto.fecha_vencimiento
      }));
      setProductos(options);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  // Obtener un inventario por su ID
  const getInventarioById = async (inventarioId) => {
    try {
      const res = await axios.get(`${URI_INVENTARIOS}${inventarioId}`);
      const inventario = res.data;  // Aquí ya no se usa [0] porque findOne devuelve un solo objeto

      if (inventario && inventario.producto) {
        setSelectedProduct({
          value: inventario.id_producto,
          label: inventario.producto.nombre || 'Producto no encontrado',  // Verificación adicional
          categoria: inventario.producto.categoria?.nombre_categoria || 'Sin categoría',
          costo: inventario.producto.costo || 0,
          fecha_vencimiento: inventario.producto.fecha_vencimiento || 'Sin fecha'
        });
        setTipoMovimiento(inventario.tipo_movimiento || '');
        setStock(inventario.stock || 0);
        setPrecio(inventario.precio || 0);
        setUnidadMedida(inventario.unidad_medida || '');
        setFechaMovimiento(inventario.fecha_movimiento?.split('T')[0] || '');  // Verifica que la fecha exista
      } else {
        console.error("Inventario o producto no encontrado en la respuesta de la API", res.data);
      }

      setLoading(false);  // Termina de cargar los datos
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
      setLoading(false);  // Termina de cargar aunque haya error
    }
  };

  // Procedimiento para actualizar el inventario
  const actualizar = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error("Selecciona un producto");
      return;
    }

    try {
      // Realizar el PUT para actualizar el inventario
      await axios.put(`${URI_INVENTARIOS}${id}`, {
        id_producto: selectedProduct.value,
        tipo_movimiento,
        stock: parseInt(stock, 10),
        precio: parseFloat(precio).toFixed(2),
        unidad_medida,
        fecha_movimiento
      });

      // Mostrar mensaje de éxito
      toast.success('Inventario actualizado con éxito');  // Mostrar notificación
      // Redirigir a la lista de inventarios después de actualizar
      navigate('/inventarios');
    } catch (error) {
      toast.error('Error al actualizar el inventario');
      console.error('Error al actualizar el inventario:', error);
    }
  };

  // Función para manejar el evento de cancelación
  const cancelar = () => {
    navigate('/inventarios');
  };

  if (loading) {
    return <div>Cargando datos...</div>;  // Indicador de carga mientras los datos están siendo obtenidos
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Editar Inventario</h3>
            </div>
            <div className="card-body">
              <form onSubmit={actualizar}>
                {/* Selección de Producto - Deshabilitado */}
                <div className="mb-3">
                  <label className="form-label">Producto</label>
                  <Select
                    value={selectedProduct}
                    options={productos}
                    placeholder="Seleccionar producto"
                    isDisabled={true} // Deshabilitamos la selección del producto
                  />
                </div>

                {/* Mostrar la información del producto seleccionado */}
                {selectedProduct && (
                  <div className="product-info mt-3">
                    <p><strong>Categoría:</strong> {selectedProduct.categoria}</p>
                    <p><strong>Costo:</strong> {selectedProduct.costo}</p>
                    <p><strong>Fecha de Vencimiento:</strong> {selectedProduct.fecha_vencimiento}</p>
                  </div>
                )}

                {/* Tipo de Movimiento - Deshabilitado */}
                <div className="mb-3">
                  <label className="form-label">Tipo de Movimiento</label>
                  <select
                    value={tipo_movimiento}
                    onChange={(e) => setTipoMovimiento(e.target.value)}
                    className="form-select"
                    required
                    disabled // Deshabilitamos el tipo de movimiento
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                  </select>
                </div>

                {/* Stock - Editable */}
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

                {/* Precio - Editable */}
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

                {/* Unidad de Medida - Editable */}
                <div className="mb-3">
                  <label className="form-label">Unidad de Medida</label>
                  <input
                    value={unidad_medida}
                    onChange={(e) => setUnidadMedida(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>

                {/* Fecha de Movimiento - Deshabilitado */}
                <div className="mb-3">
                  <label className="form-label">Fecha de Movimiento</label>
                  <input
                    value={fecha_movimiento}
                    onChange={(e) => setFechaMovimiento(e.target.value)}
                    type="date"
                    className="form-control"
                    required
                    disabled // Deshabilitamos la fecha de movimiento
                  />
                </div>

                <div className="form-group text-center">
                  <button type="submit" className="btn btn-primary mr-4 mx-4">Actualizar</button>
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

export default CompEditInventories;
