import React from 'react';
import { Modal } from 'react-bootstrap';
import { format } from 'date-fns';

const KardexModal = ({ show, onHide, kardexData }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Kardex del Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        {kardexData.map((mov) => (
                            <tr key={mov.id}>
                                <td>{format(new Date(mov.fecha_movimiento), 'dd/MM/yyyy HH:mm:ss')}</td>
                                <td>{mov.tipo_movimiento}</td>
                                <td>{mov.cantidad}</td>
                                <td>S/{parseFloat(mov.precio || 0).toFixed(2)}</td>
                                <td>{mov.saldo}</td>
                                <td>{mov.descripcion || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal.Body>
        </Modal>
    );
};

export default KardexModal;
