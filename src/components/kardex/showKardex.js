import React from 'react';
import { Modal } from 'react-bootstrap';
import { format } from 'date-fns';

const KardexModal = ({ show, onHide, kardexData, precioInventario, nombreProducto }) => {
    const calcularSaldos = (data) => {
        let saldoAcumulado = 0;
        return data.map((mov) => {
            saldoAcumulado =
                mov.tipo_movimiento === 'Entrada'
                    ? saldoAcumulado + mov.cantidad
                    : saldoAcumulado - mov.cantidad;
            return { ...mov, saldo: saldoAcumulado };
        });
    };

    const movimientosConSaldos = calcularSaldos(kardexData);

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                {/* Cambia el título dinámicamente */}
                <Modal.Title>Kardex de {nombreProducto}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {movimientosConSaldos.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Fecha Movimiento</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Saldo</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientosConSaldos.map((mov) => (
                                <tr key={mov.id}>
                                    <td>{format(new Date(mov.fecha_movimiento), 'dd/MM/yyyy HH:mm:ss')}</td>
                                    <td>{mov.tipo_movimiento}</td>
                                    <td>{mov.cantidad}</td>
                                    <td>S/{parseFloat(precioInventario || 0).toFixed(2)}</td>
                                    <td>{mov.saldo}</td>
                                    <td>{mov.descripcion || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay movimientos registrados en el Kardex.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default KardexModal;
