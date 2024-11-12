import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

// URIs para los productos e inventarios
const URI_INVENTARIOS = 'http://localhost:8000/inventarios/';
const URI_PRODUCTOS = 'http://localhost:8000/productos/';

const CompCreateInventories = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tipo_movimiento, setTipoMovimiento] = useState('Entrada');
  const [stock, setStock] = useState('');
  const [precio, setPrecio] = useState('');
  const [unidad_medida, setUnidadMedida] = useState('');
  const [fecha_movimiento, setFechaMovimiento] = useState('');
  const [productos, setProductos] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const navigate = useNavigate();

  // Obtener la fecha actual en formato ISO y setearla como fecha de movimiento por defecto
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    setFechaMovimiento(currentDate);
    getProductos();
  }, []);

  const getProductos = async () => {
    try {
      const res = await axios.get(URI_PRODUCTOS);
      const options = res.data.map(producto => ({
        value: producto.id,
        label: `${producto.nombre}`,
        categoria: producto.categoria?.nombre_categoria || 'Sin categoría',
        costo: producto.costo,
        fecha_vencimiento: producto.fecha_vencimiento
      }));
      setProductos(options);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleProductChange = (producto) => {
    setSelectedProduct(producto);
    if (producto) {
      setProductDetails({
        categoria: producto.categoria,
        costo: producto.costo,
        fecha_vencimiento: producto.fecha_vencimiento || 'Sin fecha'
      });
    } else {
      setProductDetails(null);
    }
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("Selecciona un producto");
      return;
    }

    try {
      await axios.post(URI_INVENTARIOS, {
        id_producto: selectedProduct.value,
        tipo_movimiento,
        stock: parseInt(stock, 10),
        precio: parseFloat(precio).toFixed(2),
        unidad_medida,
        fecha_movimiento
      });
      toast.success('Inventario registrado con éxito');
      navigate('/inventarios');
    } catch (error) {
      toast.error('Error al crear el inventario');
      console.error('Error al crear el inventario:', error);
    }
  };

  const cancelar = () => {
    navigate('/inventarios');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Registrar Nuevo Inventario</h3>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                {/* Selección de Producto */}
                <div className="mb-3">
                  <label className="form-label">Producto</label>
                  <Select
                    value={selectedProduct}
                    onChange={handleProductChange}
                    options={productos}
                    placeholder="Buscar y seleccionar producto..."
                    isClearable
                  />
                </div>

                {/* Mostrar la información del producto seleccionado */}
                {productDetails && (
                  <div className="product-info mt-3">
                    <p><strong>Categoría:</strong> {productDetails.categoria}</p>
                    <p><strong>Costo:</strong> {productDetails.costo}</p>
                    <p><strong>Fecha de Vencimiento:</strong> {productDetails.fecha_vencimiento}</p>
                  </div>
                )}

                {/* Tipo de Movimiento */}
                <div className="mb-3">
                  <label className="form-label">Tipo de Movimiento</label>
                  <select
                    value={tipo_movimiento}
                    onChange={(e) => setTipoMovimiento(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                  </select>
                </div>

                {/* Stock */}
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

                {/* Precio */}
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

                {/* Unidad de Medida */}
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

                {/* Fecha de Movimiento (automática y desactivada) */}
                <div className="mb-3">
                  <label className="form-label">Fecha de Movimiento</label>
                  <input
                    value={fecha_movimiento}
                    type="date"
                    className="form-control"
                    disabled // Desactivar el campo para que no pueda ser editado
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

export default CompCreateInventories;
