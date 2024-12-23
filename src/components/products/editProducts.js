import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URI_PRODUCTOS = "http://localhost:8000/productos";
const URI_CATEGORIAS = "http://localhost:8000/categorias";
const URI_PRODUCTOS_COMBOS = "http://localhost:8000/productosCombos";

const CompEditProducto = () => {
  const { id } = useParams();
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
    const fetchData = async () => {
      try {
        // Cargar categorías y productos de manera simultánea
        const [categoriasData, productosData] = await Promise.all([
          fetchCategorias(),
          fetchProductos(),
        ]);
  
        // Una vez cargados, cargar el producto con los datos obtenidos
        await fetchProducto(categoriasData, productosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos necesarios.");
      }
    };
  
    fetchData();
  }, []);
  
  const fetchCategorias = async () => {
    try {
      const res = await axios.get(URI_CATEGORIAS);
      if (res.status === 200) {
        const categoriasData = res.data.map((categoria) => ({
          value: categoria.id,
          label: categoria.nombre_categoria,
        }));
        setCategorias(categoriasData);
        return categoriasData; // Retorna las categorías cargadas
      }
    } catch (error) {
      toast.error("Error al cargar categorías.");
      return [];
    }
  };
  
  const fetchProductos = async () => {
    try {
      const res = await axios.get(URI_PRODUCTOS);
      if (res.status === 200) {
        const productosData = res.data.map((producto) => ({
          value: producto.id,
          label: producto.nombre_producto,
        }));
        setProductos(productosData);
        return productosData; // Retorna los productos cargados
      }
    } catch (error) {
      toast.error("Error al cargar productos.");
      return [];
    }
  };
  
  const fetchProducto = async (categoriasData, productosData) => {
    try {
      const res = await axios.get(`${URI_PRODUCTOS}/${id}`);
      const producto = res.data;
  
      // Rellenar campos del formulario
      setNombreProducto(producto.nombre_producto);
      setDescripcion(producto.descripcion);
      setCosto(producto.costo);
      setPrecio(producto.precio);
      setFechaVencimiento(producto.fecha_vencimiento || "");
      setUrlImagen(producto.imagen || "");
  
      // Seleccionar categoría
      const categoriaSeleccionada = categoriasData.find(
        (categoria) => categoria.value === producto.id_categoria
      );
      setCategoriaSeleccionada(categoriaSeleccionada);
  
      // Verificar si es un combo
      if (categoriaSeleccionada?.label.toLowerCase() === "combos") {
        setIsCombo(true);
  
        // Cargar productos del combo si es un combo
        if (productosData.length > 0) {
          await fetchProductosCombo(productosData);
        } else {
          toast.error("Error: Productos no cargados completamente.");
        }
      } else {
        setIsCombo(false);
      }
    } catch (error) {
      console.error("Error al cargar los datos del producto:", error);
      toast.error("Error al cargar los datos del producto.");
    }
  };
  
  const fetchProductosCombo = async (productosData) => {
    try {
      const res = await axios.get(`${URI_PRODUCTOS_COMBOS}/${id}`);
      if (res.status === 200) {
        const comboProductosData = res.data.map((item) => ({
          producto: productosData.find((p) => p.value === item.id_producto),
          cantidad: item.cantidad,
        }));
        setComboProductos(comboProductosData);
      }
    } catch (error) {
      console.error("Error al cargar los productos del combo:", error);
      toast.error("Error al cargar los productos del combo.");
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

  const handleActualizarProducto = async () => {
    if (!nombreProducto || !categoriaSeleccionada || !costo || !precio) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const productoActualizado = {
      nombre_producto: nombreProducto,
      descripcion,
      id_categoria: categoriaSeleccionada.value,
      costo,
      precio,
      fecha_vencimiento: fechaVencimiento || null,
      url_imagen: urlImagen || null,
    };

    try {
      // Actualizar producto
      await axios.put(`${URI_PRODUCTOS}/${id}`, productoActualizado);

      // Actualizar productos del combo si aplica
      if (isCombo) {
        await axios.put(`${URI_PRODUCTOS_COMBOS}/${id}`, {
          productos: comboProductos.map((item) => ({
            id_producto: item.producto.value,
            cantidad: item.cantidad,
          })),
        });
      }

      toast.success("Producto actualizado exitosamente.");
      navigate("/productos");
    } catch (error) {
      toast.error("Error al actualizar el producto.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Editar Producto</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Select
            options={categorias}
            value={categoriaSeleccionada}
            onChange={handleCategoriaChange}
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
                  className="flex-grow-1 me-2"
                />
                <Form.Control
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => handleCantidadComboChange(index, e.target.value)}
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
            <Button onClick={handleAgregarProductoCombo}>
              Agregar Producto al Combo
            </Button>
          </>
        )}
        <Form.Group className="mb-3">
          <Form.Label>Costo</Form.Label>
          <Form.Control
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
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
            value={urlImagen}
            onChange={(e) => setUrlImagen(e.target.value)}
          />
        </Form.Group>
        <Button onClick={handleActualizarProducto}>Actualizar</Button>
        <Button variant="danger" onClick={() => navigate("/productos")}>
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default CompEditProducto;