import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/box/';

const CompCreateBox = () => {
  const [nombre_box, setNombreBox] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const navigate = useNavigate();

  // Procedimiento para guardar el nuevo box
  const guardar = async (e) => {
    e.preventDefault(); // Corregido
    await axios.post(URI, { nombre_box, capacidad });
    navigate('/box');
  };

  const cancelar = () => {
    navigate('/box'); 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Crear un Nuevo Box</h3>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Box</label>
                  <input
                    value={nombre_box}
                    onChange={(e) => setNombreBox(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacidad</label>
                  <input
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group text-center">
                <button type="submit" className="btn btn-primary mr-4 mx-4">Guardar</button>
                <button type="button" className="btn btn-danger" onClick={cancelar}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompCreateBox;