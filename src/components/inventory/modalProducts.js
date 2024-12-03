import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const URI_PRODUCTOS = "http://localhost:8000/productos";
const CATEGORIAS_URI = "http://localhost:8000/categorias/";

const ModalCreateProduct = ({ show, onClose, onProductoCreado }) => {
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [imagen, setImagen] = useState("");
  const [categorias, setCategorias] = useState([]);

  // Carga las categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(CATEGORIAS_URI);
        if (res.status === 200) {
          setCategorias(res.data);
        }
      } catch (error) {
        toast.error("Error al cargar categorías.");
      }
    };

    if (show) {
      fetchCategorias(); // Solo carga cuando se muestra el modal
    }
  }, [show]);

  const handleGuardarProducto = async () => {
    if (!nombreProducto || !idCategoria || !precioCompra || !precioVenta) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const nuevoProducto = {
        nombre_producto: nombreProducto,
        descripcion: descripcion || "Sin descripción",
        id_categoria: idCategoria,
        precio_compra: parseFloat(precioCompra),
        precio_venta: parseFloat(precioVenta),
        fecha_vencimiento: fechaVencimiento || null,
        imagen: imagen || null,
      };

      const res = await axios.post(URI_PRODUCTOS, nuevoProducto);

      if (res.status === 201) {
        toast.success("Producto creado correctamente.");
        onProductoCreado({
          value: res.data.id,
          label: nombreProducto,
          descripcion,
          categoria_nombre: categorias.find((cat) => cat.id === idCategoria)?.nombre_categoria,
          precio_compra: precioCompra,
          precio_venta: precioVenta,
          fecha_vencimiento: fechaVencimiento || "N/A",
          imagen,
        });
        onClose(); // Cierra el modal
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el producto. Por favor, intenta nuevamente.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              placeholder="Ejemplo: Cerveza Artesanal"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={idCategoria}
              onChange={(e) => setIdCategoria(Number(e.target.value))}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Costo</Form.Label>
            <Form.Control
              type="number"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
              placeholder="Costo del producto (Ejemplo: 5.00)"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              placeholder="Precio de venta (Ejemplo: 7.50)"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Vencimiento</Form.Label>
            <Form.Control
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL de Imagen</Form.Label>
            <Form.Control
              type="text"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="URL de la imagen (Opcional)"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleGuardarProducto}
        >
          <i className="fa-solid fa-save me-2"></i> Guardar
        </Button>
        <Button
          className="btn btn-danger d-flex align-items-center"
          onClick={onClose}
        >
          <i className="fa-solid fa-arrow-left me-2"></i> Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateProduct;
