// ClienteSelect.js
import React, { useState, useEffect } from 'react';
import BuscarClienteModal from './BuscarClientesModal';
import { Button } from 'react-bootstrap';

const ClienteSelect = ({ onClienteSeleccionado, resetCliente }) => {
  const [cliente, setCliente] = useState({ nombre: 'Público General' });
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (resetCliente) {
      handleClearCliente();  // Limpiar cliente cuando `resetCliente` cambie a true
    }
  }, [resetCliente]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSelectCliente = (clienteSeleccionado) => {
    setCliente(clienteSeleccionado);
    onClienteSeleccionado(clienteSeleccionado);
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
