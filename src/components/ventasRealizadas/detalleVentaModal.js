// detalleVentaModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DetalleVentaModal = ({ venta, show, onHide }) => {
  if (!venta) return null; // Verificación en caso de que la venta aún no esté cargada

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de la Venta - {venta.codigo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Fecha:</strong> {new Date(venta.fecha_emision).toLocaleString()}</p>
        <p><strong>Cliente:</strong> {venta.cliente || "Público General"}</p>
        <p><strong>Vendedor:</strong> {venta.vendedor}</p>
        <p><strong>Total:</strong> S/ {parseFloat(venta.total).toFixed(2)}</p>

        <h5>Productos:</h5>
        <ul>
          {venta.detalleventas && venta.detalleventas.map((detalle) => (
            <li key={detalle.id_producto}>
              {detalle.producto.nombre} - Cantidad: {detalle.cantidad} - Subtotal: S/ {parseFloat(detalle.subtotal).toFixed(2)}
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetalleVentaModal;
