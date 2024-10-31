// ClienteSelect.js
import React, { useState } from 'react';
import BuscarClienteModal from './BuscarClientesModal';
import { Button } from 'react-bootstrap';

const ClienteSelect = ({ onClienteSeleccionado }) => {
  const [cliente, setCliente] = useState({ nombre: 'Público General' });
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSelectCliente = (clienteSeleccionado) => {
    setCliente(clienteSeleccionado);
    onClienteSeleccionado(clienteSeleccionado); // Asegurarse de pasar el objeto completo
    console.log("Cliente seleccionado:", cliente); // Agrega un log para depurar
    handleCloseModal();
  };

  const handleClearCliente = () => {
    setCliente({ nombre: 'Público General' });
    onClienteSeleccionado(null); // Notifica que no hay cliente seleccionado
  };

  return (
    <div className="cliente-select">
      <label>Cliente:</label>
      <div className="d-flex align-items-center">
        <input 
          type="text" 
          value={`${cliente.nombre} ${cliente.apellido || ''}`} 
          readOnly 
          className="form-control" 
          style={{ maxWidth: '200px' }} 
        />
        {cliente.nombre !== 'Público General' ? (
          <Button variant="danger" onClick={handleClearCliente} className="ms-2">
            <i className="fa fa-user-times"></i>
          </Button>
        ) : (
          <Button variant="primary" onClick={handleOpenModal} className="ms-2">
            <i className="fa fa-user-plus"></i>
          </Button>
        )}
      </div>
      <BuscarClienteModal
        show={isModalOpen}
        onHide={handleCloseModal}
        onSelectCliente={handleSelectCliente}
      />
    </div>
  );
};

export default ClienteSelect;
