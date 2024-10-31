import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const BuscarClienteModal = ({ show, onHide, onSelectCliente }) => {
  const [term, setTerm] = useState('');
  const [clientes, setClientes] = useState([]); // Asegúrate de que sea un arreglo vacío por defecto

  const buscarClientes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/clientes/search/${term}`);
      setClientes(response.data || []); // Asegúrate de que sea un arreglo
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      setClientes([]); // En caso de error, asigna un arreglo vacío
    }
  };

  useEffect(() => {
    if (!show) {
      setTerm('');
      setClientes([]); // Restablece a un arreglo vacío cuando el modal se cierra
    }
  }, [show]);

  const handleSelect = (cliente) => {
    onSelectCliente({ ...cliente, id_cliente: cliente.id }); // Mapea `id` a `id_cliente`
    onHide();
  };  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Buscar y Agregar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          placeholder="Documento, Nombre, Apellido"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="form-control mb-2"
        />
        <Button onClick={buscarClientes} variant="secondary" className="mb-3">
          Buscar
        </Button>
        <div>
          {clientes && clientes.length > 0 ? ( // Comprueba que clientes no sea null y tenga elementos
            clientes.map((cliente) => (
              <div key={cliente.id_cliente} className="d-flex justify-content-between align-items-center mb-2">
                <span>{cliente.nombre} {cliente.apellido} (DNI: {cliente.dni})</span>
                <Button variant="outline-primary" onClick={() => handleSelect(cliente)}>
                  Seleccionar
                </Button>
              </div>
            ))
          ) : (
            <p>No se encontraron resultados</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuscarClienteModal;
