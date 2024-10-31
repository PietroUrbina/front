import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ClienteSelect from './ClienteSelect';
import './ventas.css';

const Venta = ({ usuario }) => {
  const [productos, setProductos] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [totalPagado, setTotalPagado] = useState(0);
  const [evidencia, setEvidencia] = useState(null);
  const [nroOperacion, setNroOperacion] = useState('');
  const [cambio, setCambio] = useState(0); 
  const [fechaActual, setFechaActual] = useState(new Date().toLocaleDateString());
  const [usuarioEditable, setUsuarioEditable] = useState(usuario.nombre_usuario);
  const [tipoComprobante, setTipoComprobante] = useState('Boleta');
  const [estado, setEstado] = useState('Emitido'); // Estado predeterminado

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/productos/con-inventario');
        setProductos(response.data.map(producto => ({
          value: producto.id,
          label: producto.nombre
        })));
      } catch (error) {
        console.error("Error al cargar productos con inventario:", error);
      }
    };
    fetchProductos();
  }, []);

  const agregarProducto = async () => {
    if (!selectedProducto || !selectedProducto.value) return;

    const url = `http://localhost:8000/inventarios/producto/${selectedProducto.value}`;
  
    try {
      const response = await axios.get(url);
      const { stock, precio } = response.data;
      const precioUnitario = parseFloat(precio);

      const productoExistente = detalleVenta.find(item => item.id_producto === selectedProducto.value);
      if (productoExistente) return;

      setDetalleVenta(prevDetalle => [
        ...prevDetalle,
        {
          id_producto: selectedProducto.value,
          nombre: selectedProducto.label,
          stock: stock !== null ? stock : 'N/A',
          cantidad: 1,
          precio_unitario: precioUnitario,
          subtotal: precioUnitario
        }
      ]);

      setSelectedProducto(null);
    } catch (error) {
      console.error("Error al obtener detalles del inventario:", error);
    }
  };

  const actualizarCantidad = (index, cantidad) => {
    const stockDisponible = detalleVenta[index].stock;
    cantidad = Math.max(1, Math.min(cantidad, stockDisponible));

    const newDetalle = [...detalleVenta];
    newDetalle[index].cantidad = cantidad;
    newDetalle[index].subtotal = cantidad * newDetalle[index].precio_unitario;
    setDetalleVenta(newDetalle);
  };

  const handleTotalPagadoChange = (value) => {
    setTotalPagado(value);
    setCambio(value >= total ? value - total : 0);
  };

  const eliminarProducto = (index) => {
    setDetalleVenta(detalleVenta.filter((_, i) => i !== index));
  };

  const total = detalleVenta.reduce((acc, item) => acc + item.subtotal, 0);

  const registrarVenta = async () => {
    if (!usuario || !usuario.id) return;
    if (!clienteSeleccionado || !clienteSeleccionado.id_cliente) {
      console.error("El cliente seleccionado no es válido o está vacío.");
      return;
    }
  
    console.log("Cliente seleccionado antes de registrar venta:", clienteSeleccionado);
  
    const ventaData = {
      id_usuario: usuario.id,
      id_cliente: clienteSeleccionado.id_cliente, 
      metodo_pago: metodoPago,
      total,
      total_pagado: metodoPago === "efectivo" ? totalPagado : null,
      evidencia: metodoPago !== "efectivo" ? evidencia : null,
      nro_operacion: metodoPago !== "efectivo" ? nroOperacion : null,
      tipo_comprobante: tipoComprobante,
      estado,
      productos: detalleVenta.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        subtotal: item.subtotal
      })),
    };
  
    try {
      await axios.post('http://localhost:8000/ventas', ventaData);
      setDetalleVenta([]);
      setTotalPagado(0);
      setEvidencia(null);
      setNroOperacion('');
      setCambio(0);
      console.log("Venta registrada con éxito");
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    }
  };
  

  return (
    <div className="venta-container">
      <div className="producto-section">
        <div className="producto-select" style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            options={productos}
            placeholder="Buscar producto"
            value={selectedProducto}
            onChange={setSelectedProducto}
            isClearable
            styles={{ container: (provided) => ({ ...provided, width: '300px' }) }}
          />
          <button onClick={agregarProducto} className="btn-agregar"> + Agregar producto</button>
        </div>

        <table className="detalle-venta">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {detalleVenta.map((detalle, index) => (
              <tr key={detalle.id_producto}>
                <td>{detalle.nombre}</td>
                <td>{detalle.stock}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={detalle.stock}
                    value={detalle.cantidad}
                    onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                  />
                </td>
                <td>{detalle.precio_unitario.toFixed(2)}</td>
                <td>{detalle.subtotal.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => eliminarProducto(index)}
                    className="btn btn-danger btn-sm"
                    style={{ borderRadius: '5px', backgroundColor: '#dc3545', color: '#fff' }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="formulario-venta">
        <h3>Formulario de Venta</h3>
        <div>
          <label>Fecha: </label>
          <input type="text" value={fechaActual} onChange={(e) => setFechaActual(e.target.value)} />
        </div>
        <div>
          <label>Usuario: </label>
          <input type="text" value={usuarioEditable} onChange={(e) => setUsuarioEditable(e.target.value)} />
        </div>
        <ClienteSelect onClienteSeleccionado={(cliente) => {
            setClienteSeleccionado(cliente);
            console.log("Cliente seleccionado en Venta.js:", cliente); // Verifica en la consola
          }} />

        <div>
          <label>Tipo de Comprobante: </label>
          <select value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)}>
            <option value="Boleta">Boleta</option>
            <option value="Factura">Factura</option>
          </select>
        </div>
        <div>
          <label>Método de Pago: </label>
          <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
          </select>
        </div>

        {metodoPago === "efectivo" && (
          <div>
            <label>Total pagado: </label>
            <input
              type="number"
              value={totalPagado}
              onChange={(e) => handleTotalPagadoChange(Number(e.target.value))}
            />
            <div>
              <label>Cambio: </label>
              <input type="text" value={cambio.toFixed(2)} readOnly />
            </div>
          </div>
        )}

        {metodoPago !== "efectivo" && (
          <div>
            <label>Evidencia: </label>
            <input type="file" onChange={(e) => setEvidencia(e.target.files[0])} />
            <label>Número de operación: </label>
            <input
              type="text"
              value={nroOperacion}
              onChange={(e) => setNroOperacion(e.target.value)}
            />
          </div>
        )}

        <h3>Total: S/{total.toFixed(2)}</h3>
        <button className="btn-guardar" onClick={registrarVenta}>Guardar Venta</button>
      </div>
    </div>
  );
};

export default Venta;
