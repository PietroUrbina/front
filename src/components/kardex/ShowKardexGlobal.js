import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const URI_KARDEX_GLOBAL = 'http://localhost:8000/kardex/global';

const GlobalKardexModal = ({ show, onHide }) => {
    const [globalKardexData, setGlobalKardexData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) fetchGlobalKardex();
    }, [show]);

    const fetchGlobalKardex = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI_KARDEX_GLOBAL);
            setGlobalKardexData(res.data);
        } catch (error) {
            console.error('Error al obtener el Kardex global:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Kardex Global</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <p>Cargando movimientos...</p>
                ) : globalKardexData.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Tipo Movimiento</th>
                                <th>Cantidad</th>
                                <th>Fecha Movimiento</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {globalKardexData.map((mov) => (
                                <tr key={mov.id}>
                                    <td>{mov.nombre_producto}</td>
                                    <td>{mov.tipo_movimiento}</td>
                                    <td>{mov.cantidad}</td>
                                    <td>{format(new Date(mov.fecha_movimiento), 'dd/MM/yyyy HH:mm:ss')}</td>
                                    <td>{mov.descripcion || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay movimientos registrados en el Kardex global.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GlobalKardexModal;
