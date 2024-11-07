import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { FaEye, FaFilePdf, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { generarPDF } from './generarPDF.js';
import DetalleVentaModal from './detalleVentaModal.js'; // Importar el nuevo modal

const VentasRealizadas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/ventas');
      setVentas(response.data);
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
    }
  };

  const generarCodigoVenta = (venta, index) => {
    const tipoSerie = venta.tipo_comprobante === "Boleta" ? "B" : "F";
    const numeroSerie = (index + 1).toString().padStart(3, "0");
    const añoVenta = new Date(venta.fecha_emision).getFullYear();
    return `${tipoSerie}${numeroSerie}-${añoVenta}`;
  };

  const handleGenerarPDF = async (venta, index) => {
    try {
      const response = await axios.get(`http://localhost:8000/ventas/${venta.id}`);
      const ventaCompleta = response.data;
      const codigo = generarCodigoVenta(ventaCompleta, index);
      generarPDF(ventaCompleta, codigo);
    } catch (error) {
      console.error("Error al obtener los detalles de la venta para el PDF:", error);
      Swal.fire('Error', 'No se pudieron cargar los detalles de la venta para el PDF.', 'error');
    }
  };

  const handleEditarEstado = (venta) => {
    Swal.fire({
      title: 'Editar Estado',
      text: "¿Quieres cancelar esta venta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:8000/ventas/${venta.id}`, { estado: 'Cancelado' });
          fetchVentas();
          Swal.fire('Cancelada', 'La venta ha sido cancelada.', 'success');
        } catch (error) {
          console.error("Error al cancelar la venta:", error);
          Swal.fire('Error', 'Hubo un error al cancelar la venta.', 'error');
        }
      }
    });
  };

  const handleVerDetalle = async (venta) => {
    try {
      const response = await axios.get(`http://localhost:8000/ventas/${venta.id}`);
      setVentaSeleccionada(response.data); // Almacenar todos los detalles de la venta
      setShowDetalle(true);
    } catch (error) {
      console.error("Error al obtener detalles de la venta:", error);
      Swal.fire('Error', 'No se pudieron cargar los detalles de la venta.', 'error');
    }
  };

  const handleCloseDetalle = () => setShowDetalle(false);

  return (
    <div className="container mt-4">
      <h2>Ventas Realizadas</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Total</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, index) => {
            const codigo = generarCodigoVenta(venta, index);
            return (
              <tr key={venta.id}>
                <td>{codigo}</td>
                <td>{new Date(venta.fecha_emision).toLocaleString()}</td>
                <td>{venta.cliente || "Público General"}</td>
                <td>{venta.vendedor}</td>
                <td>{venta.total ? `S/ ${parseFloat(venta.total).toFixed(2)}` : "S/ 0.00"}</td>
                <td>
                  <Button variant="info" className="me-2" onClick={() => handleVerDetalle(venta)}>
                    <FaEye />
                  </Button>
                  <Button variant="primary" className="me-2" onClick={() => handleGenerarPDF(venta, index)}>
                    <FaFilePdf />
                  </Button>
                  <Button variant="warning" className="me-2" onClick={() => handleEditarEstado(venta)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => handleEditarEstado(venta)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal de Detalle de Venta */}
      <DetalleVentaModal 
        venta={ventaSeleccionada}
        show={showDetalle}
        onHide={handleCloseDetalle}
      />
    </div>
  );
};

export default VentasRealizadas;
