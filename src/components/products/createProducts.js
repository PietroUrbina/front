import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URI_PRODUCTOS = "http://localhost:8000/productos";
const URI_CATEGORIAS = "http://localhost:8000/categorias";
const URI_PRODUCTOS_COMBOS = "http://localhost:8000/productosCombos";

const CompCreateProducto = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const [precio, setPrecio] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isCombo, setIsCombo] = useState(false);
  const [comboProductos, setComboProductos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await axios.get(URI_CATEGORIAS);
      if (res.status === 200) {
        setCategorias(
          res.data.map((categoria) => ({
            value: categoria.id,
            label: categoria.nombre_categoria,
          }))
        );
      }
    } catch (error) {
      toast.error("Error al cargar categorías.");
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get(URI_PRODUCTOS);
      if (res.status === 200) {
        setProductos(
          res.data.map((producto) => ({
            value: producto.id,
            label: producto.nombre_producto,
          }))
        );
      }
    } catch (error) {
      toast.error("Error al cargar productos.");
    }
  };

  const handleCategoriaChange = (selectedOption) => {
    setCategoriaSeleccionada(selectedOption);
    setIsCombo(selectedOption?.label.toLowerCase() === "combos");
  };

  const handleAgregarProductoCombo = () => {
    setComboProductos([...comboProductos, { producto: null, cantidad: 1 }]);
  };

  const handleProductoComboChange = (index, selectedProducto) => {
    const nuevosProductos = [...comboProductos];
    nuevosProductos[index].producto = selectedProducto;
    setComboProductos(nuevosProductos);
  };

  const handleCantidadComboChange = (index, cantidad) => {
    const nuevosProductos = [...comboProductos];
    nuevosProductos[index].cantidad = parseInt(cantidad) || 1;
    setComboProductos(nuevosProductos);
  };

  const handleEliminarProductoCombo = (index) => {
    const nuevosProductos = [...comboProductos];
    nuevosProductos.splice(index, 1);
    setComboProductos(nuevosProductos);
  };

  const handleGuardarProducto = async () => {
    if (!nombreProducto || !categoriaSeleccionada || !costo || !precio) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const nuevoProducto = {
      nombre_producto: nombreProducto,
      descripcion,
      id_categoria: categoriaSeleccionada.value,
      precio_compra: costo,
      precio_venta: precio,
      fecha_vencimiento: fechaVencimiento || null,
      imagen: urlImagen || null,
    };

    try {
      // Guardar el producto
      const res = await axios.post(URI_PRODUCTOS, nuevoProducto);
      const productoCreado = res.data.producto; // Asegurarse de que aquí se obtiene el producto creado correctamente

      // Si es combo, guardar los productos del combo
      if (isCombo && comboProductos.length > 0) {
        for (const item of comboProductos) {
          await axios.post(URI_PRODUCTOS_COMBOS, {
            id_producto_combo: productoCreado.id,
            id_producto: item.producto.value,
            cantidad: item.cantidad,
          });
        }
      }

      toast.success("Producto creado exitosamente.");
      navigate("/productos");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el producto. Verifica los datos ingresados.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Crear un Nuevo Producto</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa el nombre del producto"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Ingresa una descripción del producto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Select
            options={categorias}
            onChange={handleCategoriaChange}
            placeholder="Selecciona una categoría"
          />
        </Form.Group>

        {isCombo && (
          <>
            <h5>Productos del Combo</h5>
            {comboProductos.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Select
                  options={productos}
                  value={item.producto}
                  onChange={(selected) =>
                    handleProductoComboChange(index, selected)
                  }
                  placeholder="Selecciona un producto"
                  className="flex-grow-1 me-2"
                />
                <Form.Control
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => handleCantidadComboChange(index, e.target.value)}
                  placeholder="Cantidad"
                  className="me-2"
                  style={{ width: "100px" }}
                />
                <Button
                  variant="danger"
                  onClick={() => handleEliminarProductoCombo(index)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
            <Button variant="primary" onClick={handleAgregarProductoCombo}>
              Agregar Producto al Combo
            </Button>
          </>
        )}

        <Form.Group className="mb-3 mt-3">
          <Form.Label>Costo</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingresa el costo"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingresa el precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de Vencimiento (opcional)</Form.Label>
          <Form.Control
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL de Imagen (opcional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa la URL de la imagen"
            value={urlImagen}
            onChange={(e) => setUrlImagen(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleGuardarProducto}>
            Guardar
          </Button>
          <Button variant="danger" onClick={() => navigate("/productos")}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CompCreateProducto;