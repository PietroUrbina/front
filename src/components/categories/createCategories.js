// CompCreateCategoria.js
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify

const URI = 'http://localhost:8000/categorias/';

const CompCreateCategorias = () => {
  const [nombre_categoria, setNombreCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const navigate = useNavigate();

  // Procedimiento para guardar la nueva categoría
  const guardar = async (e) => {
    e.preventDefault();
    await axios.post(URI, { nombre_categoria, descripcion });
    toast.success('Categoría registrada con éxito');  // Mostrar éxito
    navigate('/categorias');
  };

  const cancelar = () => {
    navigate('/categorias'); 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Crear una Nueva Categoría</h3>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                <div className="mb-3">
                  <label className="form-label">Nombre de la Categoría</label>
                  <input
                    value={nombre_categoria}
                    onChange={(e) => setNombreCategoria(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    type="text"
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

export default CompCreateCategorias;
