import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Button, Form, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URI_INVENTARIOS = "http://localhost:8000/inventarios";
const URI_PRODUCTOS = "http://localhost:8000/productos";

const CompEditInventory = () => {
  const { id } = useParams(); // ID del inventario a editar
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [unidad_medida, setUnidadMedida] = useState(""); // Unidad de medida seleccionada
  const [stock, setStock] = useState(""); // Stock registrado
  const [precio, setPrecio] = useState(""); // Precio registrado
  const [fechaActualizacion] = useState(new Date().toLocaleString()); // Fecha actual automática
  const navigate = useNavigate();

  const unidadOptions = [
    { value: "UNIDAD", label: "Unidad" },
    { value: "BOTELLA", label: "Botella" },
    { value: "COPA", label: "Copa" },
    { value: "VASO", label: "Vaso" },
    { value: "LATA", label: "Lata" },
    { value: "SIXPACK", label: "Sixpack" },
    { value: "VALDE", label: "Valde" },
    { value: "CAJA", label: "Caja" },
  ];

  // Función para cargar los productos
  const fetchProductos = async () => {
    try {
      const res = await axios.get(URI_PRODUCTOS);
      const productosData = res.data.map((producto) => ({
        value: producto.id,
        label: producto.nombre_producto,
        categoria_nombre: producto.categoria?.nombre_categoria || "Sin categoría",
        ...producto,
      }));
      setProductos(productosData);
      return productosData; // Devuelve la lista de productos
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos.");
      return [];
    }
  };

  // Función para cargar los datos del inventario
  const fetchInventario = async (productosData) => {
    try {
      const res = await axios.get(`${URI_INVENTARIOS}/${id}`);
      const inventario = res.data;
  
      // Buscar el producto relacionado en la lista de productos
      const productoRelacionado = productosData.find(
        (producto) => producto.id === inventario.id_producto
      );
  
      setProductoSeleccionado({
        value: productoRelacionado?.id || null,
        label: productoRelacionado?.nombre_producto || "Producto no encontrado",
        categoria_nombre: productoRelacionado?.categoria_nombre || "Sin categoría",
        ...productoRelacionado,
      });
  
      // Cargar los valores del inventario
      setUnidadMedida(inventario.unidad_medida || ""); // Unidad de medida existente
      setStock(inventario.stock?.toString() || ""); // Convertimos a string para el input
      setPrecio(inventario.precio?.toString() || inventario.producto?.precio_venta?.toString() || ""); // Aquí se asegura que se use el precio correcto
    } catch (error) {
      console.error("Error al cargar el inventario:", error);
      toast.error("Error al cargar el inventario.");
    }
  };

  // useEffect para cargar los datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      const productosData = await fetchProductos(); // Carga productos primero
      await fetchInventario(productosData); // Luego carga el inventario
    };

    fetchData();
  }, [id]); // Ejecuta cada vez que cambia el ID

  const handleUnidadMedidaChange = (selectedOption) => {
    setUnidadMedida(selectedOption?.value || "");
  };

  const handleActualizarInventario = async () => {
    if (!unidad_medida || !stock || !precio) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await axios.put(`${URI_INVENTARIOS}/${id}`, {
        unidad_medida,
        stock: parseFloat(stock),
        precio: parseFloat(precio),
        fecha_actualizacion: new Date(), // Actualiza con la fecha actual
      });
      toast.success("Inventario actualizado exitosamente.");
      navigate("/inventarios"); // Redirigir al listado de inventarios
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el inventario.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Editar Inventario</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Producto</Form.Label>
          <Select
            options={productos}
            value={productoSeleccionado}
            isDisabled // El producto no se puede cambiar
          />
        </Form.Group>

        {productoSeleccionado && (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Detalles del Producto</Card.Title>
              <Card.Text>
                <strong>Descripción:</strong>{" "}
                {productoSeleccionado.descripcion || "Sin descripción"}
              </Card.Text>
              <Card.Text>
                <strong>Categoría:</strong>{" "}
                {productoSeleccionado.categoria_nombre || "Sin categoría"}
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
            value={unidadOptions.find((option) => option.value === unidad_medida)}
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
            type="number"
            placeholder="Ingresa el precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de Actualización</Form.Label>
          <Form.Control
            type="text"
            value={new Date().toLocaleString()}
            readOnly
            className="bg-light"
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleActualizarInventario}>
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
    </div>
  );
};

export default CompEditInventory;
