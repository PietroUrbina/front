import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { Button, Form, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URI_INVENTARIOS = "http://localhost:8000/inventarios";
const URI_PRODUCTOS = "http://localhost:8000/productos";
const URI_UNIDADES_MEDIDA = "http://localhost:8000/unidadMedida";

const CompEditInventory = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState(null);
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");
  const navigate = useNavigate();

  // Función para cargar los productos
  const fetchProductos = useCallback(async () => {
    try {
      const res = await axios.get(URI_PRODUCTOS);
      const productosData = res.data.map((producto) => ({
        value: producto.id,
        label: producto.nombre_producto,
        categoria_nombre: producto.categoria?.nombre_categoria || "Sin categoría",
        ...producto,
      }));
      setProductos(productosData);
      return productosData;
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos.");
      return [];
    }
  }, []);

  // Función para cargar las unidades de medida
  const fetchUnidadesMedida = async () => {
    try {
      const res = await axios.get(URI_UNIDADES_MEDIDA);
      if (res.status === 200) {
        const unidadesData = res.data.map((unidad) => ({
          value: unidad.id,
          label: unidad.nombre_unidad,
          ...unidad,
        }));
        setUnidadesMedida(unidadesData);
        return unidadesData;
      }
    } catch (error) {
      console.error("Error al cargar unidades de medida:", error);
      toast.error("Error al cargar unidades de medida.");
      return [];
    }
  };

  // Función para cargar los datos del inventario
  const fetchInventario = useCallback(
    async (productosData, unidadesData) => {
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

            // Buscar la unidad de medida relacionada
            const unidadMedidaRelacionada = unidadesData.find(
                (unidad) => unidad.label === inventario.unidad_medida.nombre_unidad
            );

            if (unidadMedidaRelacionada) {
                setUnidadMedidaSeleccionada(unidadMedidaRelacionada);
            } else {
                console.warn("Unidad de medida no encontrada en el inventario.");
            }

            setStock(inventario.stock?.toString() || "");
            setPrecio(inventario.precio?.toString() || ""); // Capturar el precio desde el inventario
        } catch (error) {
            console.error("Error al cargar el inventario:", error);
            toast.error("Error al cargar el inventario.");
        }
    },
    [id]
);

  // useEffect para cargar los datos iniciales
  useEffect(() => {
    const fetchData = async () => {
        const unidadesData = await fetchUnidadesMedida();
        const productosData = await fetchProductos();
        await fetchInventario(productosData, unidadesData);
    };

    fetchData();
}, [fetchProductos, fetchInventario]);

  const handleUnidadMedidaChange = (selectedOption) => {
    setUnidadMedidaSeleccionada(selectedOption);
  };

  const handleActualizarInventario = async () => {
    if (!unidadMedidaSeleccionada || !stock || !precio) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await axios.put(`${URI_INVENTARIOS}/${id}`, {
        id_unidad_medida: unidadMedidaSeleccionada.value,
        stock: parseFloat(stock),
        precio: parseFloat(precio),
        fecha_actualizacion: new Date(),
      });
      toast.success("Inventario actualizado exitosamente.");
      navigate("/inventarios");
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
            isDisabled
          />
        </Form.Group>

        {productoSeleccionado && (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Detalles del Producto</Card.Title>
              <Card.Text>
                <strong>Descripción:</strong> {productoSeleccionado.descripcion || "Sin descripción"}
              </Card.Text>
              <Card.Text>
                <strong>Categoría:</strong> {productoSeleccionado.categoria_nombre || "Sin categoría"}
              </Card.Text>
              <Card.Text>
                <strong>Costo:</strong> S/{productoSeleccionado.precio_compra}
              </Card.Text>
              <Card.Text>
                <strong>Precio de Referencia:</strong> S/{productoSeleccionado.precio_venta}
              </Card.Text>
              <Card.Text>
                <strong>Fecha de Vencimiento:</strong> {productoSeleccionado.fecha_vencimiento || "N/A"}
              </Card.Text>
            </Card.Body>
          </Card>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Unidad de Medida</Form.Label>
          <Select
              options={unidadesMedida}
              value={unidadMedidaSeleccionada}
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