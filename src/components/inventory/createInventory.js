import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalCreateProduct from "./modalProducts";

const URI_PRODUCTOS = "http://localhost:8000/productos";
const URI_INVENTARIOS = "http://localhost:8000/inventarios";

const CompCreateInventory = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [unidad_medida, setUnidadMedida] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState(""); // Modificable por el usuario
  const [mostrarCrearProductoModal, setMostrarCrearProductoModal] = useState(
    false
  );
  const navigate = useNavigate();

  const unidadOptions = [
    { value: "UNIDAD", label: "Unidad" },
    { value: "BOTELLA", label: "Botella" },
    { value: "COPA", label: "Copa" },
    { value: "VASO", label: "Vaso" },
    { value: "LATA", label: "Lata" },
  ];

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(URI_PRODUCTOS);
      if (res.status === 200) {
        setProductos(
          res.data.map((producto) => ({
            value: producto.id,
            label: producto.nombre_producto,
            ...producto,
          }))
        );
      }
    } catch (error) {
      toast.error("Error al cargar productos.");
    }
  };

  const handleSeleccionProducto = (selectedOption) => {
    setProductoSeleccionado(selectedOption);
    setPrecio(selectedOption?.precio_venta || ""); // Rellenar automáticamente el precio
  };

  const handleUnidadMedidaChange = (selectedOption) => {
    setUnidadMedida(selectedOption?.value || "");
  };

  const handleCrearInventario = async () => {
    if (!productoSeleccionado || !unidad_medida || !stock || !precio) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    try {
      await axios.post(URI_INVENTARIOS, {
        id_producto: productoSeleccionado.value,
        stock,
        precio,
        unidad_medida,
        fecha_actualizacion: new Date(),
      });
      toast.success("Inventario creado exitosamente.");
      navigate("/inventarios");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear inventario. Verifica los datos y el servidor.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Crear Inventario</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Producto</Form.Label>
          <div className="d-flex align-items-center">
            <Select
              options={productos}
              onChange={handleSeleccionProducto}
              placeholder="Selecciona o busca un producto"
              isClearable
              isSearchable
              value={productoSeleccionado}
            />
            {!productoSeleccionado && (
              <Button
                variant="primary"
                onClick={() => setMostrarCrearProductoModal(true)}
                className="ms-3"
              >
                <i className="fa-solid fa-pencil"></i> Crear Producto
              </Button>
            )}
          </div>
        </Form.Group>

        {productoSeleccionado && (
          <Card className="mb-3 small-card">
            <Card.Body>
              <Card.Title className="h6">Detalles del Producto</Card.Title>
              <Card.Text>
                <strong>Descripción:</strong> {productoSeleccionado.descripcion}
              </Card.Text>
              <Card.Text>
                <strong>Categoría:</strong>{" "}
                {productoSeleccionado.categoria_nombre}
              </Card.Text>
              <Card.Text>
                <strong>Costo:</strong> S/{productoSeleccionado.precio_compra}
              </Card.Text>
              <Card.Text>
                <strong>Precio:</strong> S/{productoSeleccionado.precio_venta}
              </Card.Text>
              <Card.Text>
                <strong>Fecha de Vencimiento:</strong>{" "}
                {productoSeleccionado.fecha_vencimiento || "N/A"}
              </Card.Text>
            </Card.Body>
          </Card>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Unidad de Medida</Form.Label>
          <Select
            options={unidadOptions}
            onChange={handleUnidadMedidaChange}
            placeholder="Selecciona la unidad de medida"
            isClearable
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingresa el stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa el precio"
            value={`S/${precio}`} // Incluye el prefijo de soles
            onChange={(e) =>
              setPrecio(e.target.value.replace("S/", "").trim())
            } // Permite modificar el precio
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de Actualización</Form.Label>
          <Form.Control
            type="text"
            value={new Date().toLocaleString()} // Fecha actual
            readOnly
            className="bg-light"
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleCrearInventario}>
            <i className="fa-solid fa-save"></i> Guardar
          </Button>
          <Button
            variant="danger"
            onClick={() => navigate("/inventarios")}
            className="ms-3"
          >
            <i className="fa-solid fa-arrow-left"></i> Cancelar
          </Button>
        </div>
      </Form>

      <ModalCreateProduct
        show={mostrarCrearProductoModal}
        onClose={() => setMostrarCrearProductoModal(false)}
        onProductoCreado={(nuevoProducto) => {
          setProductoSeleccionado(nuevoProducto);
          fetchProductos(); // Refresca la lista de productos
        }}
      />
    </div>
  );
};

export default CompCreateInventory;
