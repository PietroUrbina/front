import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/productos/';

const CompCreateProduct = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [fecha_vencimiento, setFechaVencimiento] = useState(null); // Inicializado en null
  const navigate = useNavigate();

  // Procedimiento para guardar el nuevo Producto
  const guardar = async (e) => {
    e.preventDefault();

    // Verificar si fecha_vencimiento está vacía y enviarla como null si es el caso
    const productoData = {
      nombre,
      precio,
      stock,
      fecha_vencimiento: fecha_vencimiento ? fecha_vencimiento : null, // Envía null si no hay fecha
    };

    await axios.post(URI, productoData);
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Crear un Nuevo Producto</h3>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Producto</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Vencimiento (opcional)</label>
                  <input
                    value={fecha_vencimiento || ''} // Si es null, muestra vacío
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    type="date" // Cambiado a tipo date
                    className="form-control"
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompCreateProduct;
