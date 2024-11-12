import { jsPDF } from "jspdf";
import logo from "../../assets/Logo.png";

// Función para convertir un número a palabras
const convertirNumeroALetras = (numero) => {
  return `SON: ${numero} SOLES`;
};

export const generarPDF = async (venta, codigo) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200], // Formato de ticket
  });

  // Agregar el logo
  const agregarLogo = async () => {
    const img = new Image();
    img.src = logo;
    await img.decode();
    doc.addImage(img, "PNG", 15, 5, 50, 15); // Ajuste del logo
  };

  await agregarLogo();

  // Encabezado de la empresa
  doc.setFontSize(8);
  doc.text("Culto Disco Bar", 40, 23, { align: "center" });
  doc.text("Av.Miraflores 360", 40, 27, { align: "center" });
  doc.text("Cel: 913 465 745", 40, 31, { align: "center" });

  // Información del comprobante
  doc.setFontSize(10);
  doc.text(`Comprobante: ${venta.tipo_comprobante}`, 10, 38);
  doc.text(`Serie: ${codigo}`, 10, 43);

  // Información del cliente y de la venta
  doc.setFontSize(8);
  doc.text(`Cliente: ${venta.cliente || 'Público General'}`, 10, 50);
  doc.text(`Fecha/Hora Emisión: ${new Date(venta.fecha_emision).toLocaleString()}`, 10, 54);

  // Línea divisoria
  doc.line(10, 58, 70, 58);

  // Encabezado de la tabla de productos
  doc.text("Cant", 10, 62);
  doc.text("U.M.", 20, 62);
  doc.text("Descripción", 30, 62);
  doc.text("Unit", 60, 62);
  doc.text("Total", 70, 62);

  let yPosition = 67;

  // Detalles de la venta
  if (Array.isArray(venta.detalleventas) && venta.detalleventas.length > 0) {
    venta.detalleventas.forEach((detalle) => {
      const producto = detalle.producto || {};
      const cantidad = parseInt(detalle.cantidad, 10) || 0;
      const subtotal = parseFloat(detalle.subtotal) || 0;
      const precioUnitario = subtotal / cantidad;

      doc.text(`${cantidad}`, 10, yPosition);
      doc.text("UND", 20, yPosition);
      doc.text(`${producto.nombre || "Producto sin nombre"}`, 30, yPosition);
      doc.text(`S/ ${precioUnitario.toFixed(2)}`, 60, yPosition);
      doc.text(`S/ ${subtotal.toFixed(2)}`, 70, yPosition);
      yPosition += 5;
    });
  } else {
    doc.text("No hay detalles de productos disponibles.", 10, yPosition);
    yPosition += 5;
  }

  // Línea divisoria después de los productos
  doc.line(10, yPosition, 70, yPosition);
  yPosition += 5;

  // Totales
  const total = parseFloat(venta.total) || 0;
  doc.text(`INAFECTO: S/ ${total.toFixed(2)}`, 10, yPosition);
  yPosition += 5;
  doc.text(`IGV 0%: S/ 0.00`, 10, yPosition);
  yPosition += 5;
  doc.text(`DESCUENTO: S/ 0.00`, 10, yPosition);
  yPosition += 5;
  doc.text(`IMPORTE TOTAL: S/ ${total.toFixed(2)}`, 10, yPosition);
  yPosition += 10;

  // Total en letras
  doc.text(convertirNumeroALetras(total), 10, yPosition);
  yPosition += 10;

  // Información adicional de la venta
  doc.text("N. CAJA: 1", 10, yPosition);
  doc.text("ATENCIÓN: Admin", 10, yPosition + 5);

  yPosition += 10;

  // Información de pago
  doc.text(`Forma de Pago: ${venta.metodo_pago}`, 10, yPosition);
  doc.text(`Total pagado: S/ ${(venta.total_pagado || 0).toFixed(2)}`, 10, yPosition + 5);
  doc.text(`Vuelto: S/ ${(venta.vuelto || 0).toFixed(2)}`, 10, yPosition + 10);

  yPosition += 15;

  // Mensaje de agradecimiento
  doc.setFontSize(7);
  doc.text("¡MUCHAS GRACIAS POR SU PREFERENCIA!", 10, yPosition);
  yPosition += 5;
  doc.text("Verifique el estado de su producto antes de retirarse.", 10, yPosition);
  yPosition += 5;
  doc.text("No se aceptan devoluciones.", 10, yPosition);

  // Abrir PDF en una nueva pestaña
  window.open(doc.output("bloburl"), "_blank");
};
