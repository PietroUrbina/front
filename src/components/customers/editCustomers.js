import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';  // Importar toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify

const URI = 'http://localhost:8000/clientes/';

const CompEditCustomers = () => {
    const [dni, setDni] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [direccion, setDireccion] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fecha_nacimiento, setFecha_Nacimiento] = useState('');
    const [sexo, setSexo] = useState(''); // Estado para el sexo
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID desde los parámetros de la URL

    // sexos definidos en el modelo de la base de datos
    const sexos = ['Masculino', 'Femenino', 'Otro'];

    useEffect(() => {
        // Definir la función dentro de useEffect para evitar dependencias innecesarias
        const getCustomerById = async () => {
            try {
                const res = await axios.get(`${URI}${id}`);
                if (res.data) {
                    setDni(res.data.dni || '');
                    setNombre(res.data.nombre || '');
                    setApellido(res.data.apellido || '');
                    setDireccion(res.data.direccion || '');
                    setEmail(res.data.email || '');
                    setTelefono(res.data.telefono || '');
                    setFecha_Nacimiento(res.data.fecha_nacimiento || '');

                    // Asegúrate de que el valor de sexo coincida exactamente con una opción
                    const sexoDbValue = res.data.sexo ? res.data.sexo.trim().toLowerCase() : '';
                    const matchedSexo = sexos.find((sexoOption) =>
                        sexoOption.toLowerCase() === sexoDbValue
                    );
                    setSexo(matchedSexo || ''); // Si no se encuentra, deja vacío
                }
            } catch (error) {
                console.error("Error al obtener los datos del Cliente:", error);
            }
        };

        getCustomerById();  
    });

    //validacion de caracteres en el campo telefono
    const handleTelefonoChange = (e) => {
        if (e.target.value.length <= 9) {
          setTelefono(e.target.value);
        }
    };

    // Procedimiento para actualizar
    const actualizar = async (e) => {
        e.preventDefault();
        if (telefono && telefono.length < 9) {
            alert('El teléfono debe tener hasta 9 dígitos.');
            return;
        }

        try {
            await axios.put(`${URI}${id}`, {
                dni,
                nombre,
                apellido,
                direccion,
                email,
                telefono,
                fecha_nacimiento,
                sexo  // Incluye el sexo en la actualización
            });
            toast.success('Cliente actualizado con éxito');  // Mostrar notificación de éxito
            navigate('/clientes');
        } catch (error) {
            console.error("Error al actualizar el Cliente:", error);
        }
    };

    const cancelar = () => {
        navigate('/clientes'); // Redireccionar a la página de lista de clientes
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Editar y Actualizar el Cliente</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={actualizar}>
                                <div className="mb-3">
                                    <label className="form-label">DNI del Cliente</label>
                                    <input
                                        value={dni}
                                        type="text"
                                        className="form-control"
                                        readOnly  // Este campo no es editable
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del Cliente</label>
                                    <input
                                        value={nombre}
                                        type="text"
                                        className="form-control"
                                        readOnly  // Este campo no es editable
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Apellidos del Cliente</label>
                                    <input
                                        value={apellido}
                                        type="text"
                                        className="form-control"
                                        readOnly  // Este campo no es editable
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Direccion</label>
                                    <input
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Nacimiento</label>
                                    <input
                                        value={fecha_nacimiento}
                                        onChange={(e) => setFecha_Nacimiento(e.target.value)}
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico</label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        value={telefono}
                                        onChange={handleTelefonoChange}
                                        maxLength={9}
                                        type="text"
                                        className="form-control"
                                    />
                                </div> 
                                <div className="mb-3">
                                    <label className="form-label">Sexo</label>
                                    <select
                                        value={sexo}
                                        onChange={(e) => setSexo(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Selecciona un sexo</option>
                                        {sexos.map((sexoOption, index) => (
                                            <option key={index} value={sexoOption}>
                                                {sexoOption}
                                            </option>
                                        ))}
                                    </select>
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
}

export default CompEditCustomers;
