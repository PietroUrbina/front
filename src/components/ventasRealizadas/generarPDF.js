import { jsPDF } from "jspdf";
import logo from "../../assets/Logo.png";

// Función para convertir un número a palabras (simplificada para ejemplo)
const convertirNumeroALetras = (numero) => {
  return `SON: ${numero} SOLES`;
};

export const generarPDF = async (venta, codigo) => {
  const doc = new jsPDF();

  // Agregar el logo
  const agregarLogo = async () => {
    const img = new Image();
    img.src = logo;
    await img.decode();
    doc.addImage(img, "PNG", 10, 10, 50, 15);
  };

  await agregarLogo();

  // Encabezado de la empresa
  doc.setFontSize(10);
  doc.text("Culto Disco Bar", 75, 20);
  doc.text("Av.Miraflores 360", 75, 25);
  doc.text("Cel: 913 465 745", 75, 30);

  // Información del comprobante
  doc.setFontSize(12);
  doc.text(`Comprobante: ${venta.tipo_comprobante}`, 10, 45);
  doc.text(`Serie: ${codigo}`, 10, 50);

  // Información del cliente y de la venta
  doc.setFontSize(10);
  doc.text(`DNI: ${venta.cliente?.dni || '---'}`, 10, 60);
  doc.text(`Cliente: ${venta.cliente || 'Público General'}`, 10, 65);
  doc.text(`Fecha/Hora Emisión: ${new Date(venta.fecha_emision).toLocaleString()}`, 10, 70);

  // Línea divisoria
  doc.line(10, 75, 200, 75);

  // Encabezado de la tabla de productos
  doc.text("Cant", 10, 80);
  doc.text("Descripción", 50, 80);
  doc.text("Unit", 140, 80);
  doc.text("Total", 170, 80);

  let yPosition = 85;

  // Detalles de la venta, utilizando `detalleventas` para obtener los productos
if (Array.isArray(venta.detalleventas) && venta.detalleventas.length > 0) {
  venta.detalleventas.forEach((detalle) => {
    const producto = detalle.producto || {}; // Asegurarse de que `producto` esté definido
    const cantidad = parseInt(detalle.cantidad, 10) || 0;
    const subtotal = parseFloat(detalle.subtotal) || 0;
    const precioUnitario = subtotal / cantidad;

    doc.text(`${cantidad}`, 10, yPosition);
    doc.text(`${producto.nombre || "Producto sin nombre"}`, 50, yPosition);
    doc.text(`S/ ${precioUnitario.toFixed(2)}`, 140, yPosition); // Precio unitario
    doc.text(`S/ ${subtotal.toFixed(2)}`, 170, yPosition); // Subtotal
    yPosition += 10;
  });
} else {
  doc.text("No hay detalles de productos disponibles.", 10, yPosition);
  yPosition += 10;
}

  // Línea divisoria después de los productos
  doc.line(10, yPosition, 200, yPosition);
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

  // Información de pago
  doc.text(`Forma de Pago: ${venta.metodo_pago}`, 10, yPosition);
  doc.text(`Total pagado: S/ ${(venta.total_pagado || 0).toFixed(2)}`, 100, yPosition);
  yPosition += 5;
  doc.text(`Vuelto: S/ ${(venta.vuelto || 0).toFixed(2)}`, 100, yPosition);
  yPosition += 10;

  // Mensaje de agradecimiento
  doc.setFontSize(10);
  doc.text("¡MUCHAS GRACIAS POR SU PREFERENCIA!", 10, yPosition);

  // Abrir PDF en nueva ventana
  window.open(doc.output("bloburl"), "_blank");
};
