import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './ventas.css';

const Venta = ({ usuario }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null); // Producto seleccionado
  const [idCliente, setIdCliente] = useState(null);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [totalPagado, setTotalPagado] = useState(0);
  const fechaActual = new Date().toLocaleDateString();

  // Cargar productos y clientes
  useEffect(() => {
    const fetchProductos = async () => {
      const response = await axios.get('http://localhost:8000/productos');
      setProductos(response.data.map(producto => ({
        value: producto.id_producto,
        label: producto.nombre
      })));
    };

    const fetchClientes = async () => {
      const response = await axios.get('http://localhost:8000/clientes');
      setClientes(response.data);
    };

    fetchProductos();
    fetchClientes();
  }, []);

  // Agregar producto al detalle de venta
  const agregarProducto = async () => {
    if (!selectedProducto) return;

    try {
      const response = await axios.get(`http://localhost:8000/inventarios/producto/${selectedProducto.value}`);
      const { stock, precio } = response.data;

      const productoExistente = detalleVenta.find(item => item.id_producto === selectedProducto.value);
      if (productoExistente) {
        alert("Este producto ya ha sido agregado.");
        return;
      }

      setDetalleVenta(prevDetalle => [
        ...prevDetalle,
        {
          id_producto: selectedProducto.value,
          nombre: selectedProducto.label,
          stock: stock !== null ? stock : 'N/A',
          cantidad: 1,
          precio_unitario: precio,
          subtotal: precio
        }
      ]);

      setSelectedProducto(null); // Limpiar la selección de productos después de agregar
    } catch (error) {
      console.error("Error al obtener detalles del inventario:", error);
      alert("Error al obtener detalles del inventario. Intenta nuevamente.");
    }
  };

  // Actualizar cantidad de producto
  const actualizarCantidad = (index, cantidad) => {
    const newDetalle = [...detalleVenta];
    newDetalle[index].cantidad = cantidad;
    newDetalle[index].subtotal = cantidad * newDetalle[index].precio_unitario;
    setDetalleVenta(newDetalle);
  };

  // Eliminar producto del detalle de venta
  const eliminarProducto = (index) => {
    setDetalleVenta(detalleVenta.filter((_, i) => i !== index));
  };

  // Calcular el total de la venta
  const total = detalleVenta.reduce((acc, item) => acc + item.subtotal, 0);

  // Registrar venta
  const registrarVenta = async () => {
    const ventaData = {
      id_usuario: usuario.id_usuario,
      id_cliente: idCliente,
      metodo_pago: metodoPago,
      total_pagado: totalPagado,
      productos: detalleVenta.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
      })),
    };
    try {
      const response = await axios.post('http://localhost:8000/ventas', ventaData);
      alert(`Venta registrada con éxito. Cambio: ${response.data.cambio}`);
      setDetalleVenta([]);
      setTotalPagado(0);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert("Error al registrar la venta. Intenta nuevamente.");
    }
  };

  return (
    <div className="venta-container">
      <div className="producto-section">
        {/* Selector de productos */}
        <div className="producto-select">
          <Select
            options={productos}
            placeholder="Buscar producto"
            value={selectedProducto}
            onChange={setSelectedProducto}
          />
          <button onClick={agregarProducto} className="btn-agregar">Agregar Producto</button>
        </div>

        {/* Tabla de productos */}
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
              <tr key={detalle.id_producto}> {/* Usamos id_producto como key única */}
                <td>{detalle.nombre}</td>
                <td>{detalle.stock}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={detalle.stock}
                    value={detalle.cantidad}
                    onChange={(e) => actualizarCantidad(index, parseInt(e.target.value))}
                  />
                </td>
                <td>{detalle.precio_unitario.toFixed(2)}</td>
                <td>{detalle.subtotal.toFixed(2)}</td>
                <td><button onClick={() => eliminarProducto(index)} className="fa-solid fa-trash"></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="formulario-venta">
        <h3>Formulario de Venta</h3>
        <div>
          <label>Fecha: </label>
          <input type="text" value={fechaActual} readOnly />
        </div>
        <div>
          <label>Usuario: </label>
          <input type="text" value={usuario.nombre_usuario} readOnly />
        </div>
        <div>
          <label>Cliente: </label>
          <select onChange={(e) => setIdCliente(e.target.value)}>
            <option value="">Público general</option>
            {clientes.map(cliente => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
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
        <h3>Total: ${total.toFixed(2)}</h3>
        <button className="btn-guardar" onClick={registrarVenta}>Guardar Venta</button>
      </div>
    </div>
  );
};

export default Venta;
  