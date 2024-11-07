import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ClienteSelect from './ClienteSelect';
import './ventas.css';
import Swal from 'sweetalert2';

const Venta = ({ usuario }) => {
  const [productos, setProductos] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [resetCliente, setResetCliente] = useState(false); // Nuevo estado para reiniciar cliente
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [totalPagado, setTotalPagado] = useState('');
  const [evidencia, setEvidencia] = useState(null);
  const [nroOperacion, setNroOperacion] = useState('');
  const [cambio, setCambio] = useState(0); 
  const [fechaActual, setFechaActual] = useState(new Date().toLocaleString()); // Fecha y hora actuales
  const [usuarioEditable, setUsuarioEditable] = useState(usuario.nombre_usuario);
  const [tipoComprobante, setTipoComprobante] = useState('Boleta');
  const [estado, setEstado] = useState('Emitido');
  const [descuento, setDescuento] = useState(0);

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
    if (!selectedProducto || !selectedProducto.value) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Tienes que buscar y seleccionar un producto para añadirlo a la lista.'
      });
      return;
    }

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
    const newDetalle = [...detalleVenta];
    newDetalle[index].cantidad = cantidad || '';
    newDetalle[index].subtotal = cantidad ? cantidad * newDetalle[index].precio_unitario : 0;
    setDetalleVenta(newDetalle);
  };

  const handleTotalPagadoChange = (value) => {
    setTotalPagado(value || '');
    setCambio(value >= total ? value - total : 0);
  };

  const eliminarProducto = (index) => {
    setDetalleVenta(detalleVenta.filter((_, i) => i !== index));
  };

  const totalSinDescuento = detalleVenta.reduce((acc, item) => acc + item.subtotal, 0);
  const total = totalSinDescuento - descuento;

  const registrarVenta = async () => {
    if (!usuario || !usuario.id) return;
    if (!clienteSeleccionado || !clienteSeleccionado.id_cliente) {
      console.error("El cliente seleccionado no es válido o está vacío.");
      return;
    }
    if (!detalleVenta.length) {
      alert("Por favor, agrega al menos un producto a la venta.");
      return;
    }

    // Validación del monto pagado vs total
    if (metodoPago === "efectivo" && (parseFloat(totalPagado) < total)) {
      Swal.fire({
        icon: 'error',
        title: 'Monto insuficiente',
        text: 'El monto pagado es menor a la cuenta total. Por favor, ingresa un monto suficiente.'
      });
      return;
    }

    const ventaData = {
      id_usuario: usuario.id,
      id_cliente: clienteSeleccionado.id_cliente,
      metodo_pago: metodoPago,
      total,
      total_pagado: metodoPago === "efectivo" ? totalPagado : null,
      tipo_comprobante: tipoComprobante,
      estado,
      descuento,
      fecha_emision: new Date().toISOString(), // Fecha y hora de creación
      productos: detalleVenta.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal
      })),
      ...(metodoPago !== "efectivo" && {
        nro_operacion: nroOperacion,
        evidencia: evidencia ? evidencia.name : null,
      })
    };

    try {
      await axios.post('http://localhost:8000/ventas', ventaData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setDetalleVenta([]);
      setTotalPagado('');
      setEvidencia(null);
      setNroOperacion('');
      setCambio(0);
      setDescuento(0);
      setClienteSeleccionado(null); // Limpia el cliente seleccionado
      setResetCliente(true); // Activar el reinicio del cliente en ClienteSelect
      setFechaActual(new Date().toLocaleString()); // Actualizar la fecha y hora a la actual

      Swal.fire({
        icon: 'success',
        title: 'Venta creada correctamente',
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });

      setTimeout(() => setResetCliente(false), 100); // Reiniciar el estado de reset para futuras ventas

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
          <button 
            onClick={agregarProducto} 
            className="btn-agregar" 
            disabled={!selectedProducto || detalleVenta.some(p => p.id_producto === selectedProducto.value)}
          >
            + Agregar producto
          </button>
        </div>

        <table className="detalle-venta">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock</th>
              <th>Cantidad</th>
              <th>Precio (S/)</th>
              <th>Subtotal (S/)</th>
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
                    onChange={(e) => actualizarCantidad(index, parseInt(e.target.value))}
                    placeholder="1"
                  />
                </td>
                <td>S/ {detalle.precio_unitario.toFixed(2)}</td>
                <td>S/ {detalle.subtotal.toFixed(2)}</td>
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
          <label>Fecha y Hora: </label>
          <input type="text" value={fechaActual} readOnly />
        </div>
        <div>
          <label>Usuario: </label>
          <input type="text" value={usuarioEditable} onChange={(e) => setUsuarioEditable(e.target.value)} />
        </div>
        <ClienteSelect 
          onClienteSeleccionado={(cliente) => setClienteSeleccionado(cliente)}
          resetCliente={resetCliente} // Enviamos la señal de reset
        />

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
            <label>Total pagado (S/): </label>
            <input
              type="number"
              value={totalPagado}
              onChange={(e) => handleTotalPagadoChange(Number(e.target.value))}
              placeholder="Ingrese el total pagado"
            />
            <div>
              <label>Cambio (S/): </label>
              <input type="text" value={`S/ ${cambio.toFixed(2)}`} readOnly />
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

        <div>
          <label>Descuento (S/): </label>
          <input
            type="number"
            value={descuento}
            onChange={(e) => setDescuento(Number(e.target.value))}
            placeholder="0"
          />
        </div>

        <h3>Total: S/{total.toFixed(2)}</h3>
        <button className="btn-guardar" onClick={registrarVenta} disabled={!detalleVenta.length || !clienteSeleccionado}>
          Guardar Venta
        </button>
      </div>
    </div>
  );
};

export default Venta;
