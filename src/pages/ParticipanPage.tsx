import { useEffect, useState } from "react";
import type { Evento } from "../services/eventosApi";
import {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} from "../services/eventosApi";
import { useNavigate } from "react-router-dom";


export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [editando, setEditando] = useState<Evento | null>(null);

  const [formData, setFormData] = useState<Evento>({
    nombre: "",
    descripcion: "",
    fecha_evento: "",
    tipo: "",
    lugar: "",
    estado: "ACT",
  });

  const [errorFecha, setErrorFecha] = useState<string>("");
  const [errorDescripcion, setErrorDescripcion] = useState<string>("");
  const [errorNombre, setErrorNombre] = useState<string>("");
  const [errorLugar, setErrorLugar] = useState<string>("");
  const [mensajeOk, setMensajeOk] = useState<string>("")

  const navigate = useNavigate();


  const cargarEventos = async () => {
    const data = await getEventos();
    setEventos(data);
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const guardarEvento = async () => {
  // VALIDACIÓN: Fecha obligatoria
  if (!formData.fecha_evento || formData.fecha_evento.trim() === "") {
    setErrorFecha("Debe ingresar una fecha - Obligatorio");
    return; // detener el guardado  
  }
  if (!formData.descripcion || formData.descripcion.trim() === "") {
    setErrorDescripcion("Debe ingresar una descripcion - Obligatorio");
    return; // detener el guardado  
  }  
  if (!formData.nombre || formData.nombre.trim() === "") {
    setErrorNombre("Debe ingresar un nombre de evento - Obligatorio");
    return; // detener el guardado  
  }  
  if (!formData.lugar || formData.lugar.trim() === "") {
    setErrorLugar("Debe ingresar un lugar - Obligatorio");
    return; // detener el guardado  
  } 
     
  
    setErrorFecha(""); // limpiar error si hay fecha
    setErrorDescripcion(""); // limpiar error si hay desccripcion
    setErrorNombre(""); // limpiar error si hay nombre

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha_evento: formData.fecha_evento || "",
      tipo: formData.tipo,
      lugar: formData.lugar,
      estado: formData.estado,
    };

    try {
      if (editando) {
        await actualizarEvento(editando.id!, payload);
        setMensajeOk("✔️ Evento actualizado correctamente");
        setEditando(null);
      } else {
        await crearEvento(payload);
        setMensajeOk("✔️ Evento creado correctamente");
      }
    
    

    // Resetear formulario
    setFormData({
      nombre: "",
      descripcion: "",
      fecha_evento: "",
      tipo: "",
      lugar: "",
      estado: "ACT",
    });

    cargarEventos();

    // Ocultar el mensaje después de 4 segundos
    setTimeout(() => setMensajeOk(""), 4000);

  } catch (error) {
    console.error("Error al guardar evento: ", error);
    setErrorFecha("Error al guardar evento, revisa los datos.");
    setErrorDescripcion("Error al guardar evento, revisa la descripción.");
  }

  };

  const editar = (evento: Evento) => {
    setEditando(evento);
    setFormData({
      ...evento,
      fecha_evento: evento.fecha_evento || "",
    });
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este evento?")) {
      await eliminarEvento(id);
      cargarEventos();
    }
  };

  return (
    <div style={{ width: "90vw", margin: 0, padding: "10px", boxSizing: "border-box" }}>
      <h2 style={{ textAlign: "center", marginBottom: 2 }}>GESTIÓN DE EVENTOS</h2>

      {/* Botón regresar al menú */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button
          onClick={() => navigate("/menu")}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.6rem",
            alignItems: "rigth",
          }}
        >
          ⬅ Volver al Menú
        </button>
      </div>

      {mensajeOk && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "10px",
            textAlign: "center",
            border: "1px solid #c3e6cb",
            fontWeight: "bold",
          }}
        >
          {mensajeOk}
        </div>
      )}

      {/* Formulario */}
      <div
        style={{
          padding: "15px",
          borderRadius: "14px",
          background: "#f0f0f0",
          //boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#add8e6",
          marginBottom: "5px",
          width: "100%",
        }}
      >
        <h3 style={{ marginBottom: "10px", textAlign: "center", color: "#444", fontSize: "1.2rem" }}>
          {editando ? "✏️ Editar Evento" : "📝 Crear Evento"}
        </h3>

        {/* Campo - Nombre */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>Nombre del Evento:</label>
          <input
            name="nombre"
            placeholder="Nombre del Evento"
            value={formData.nombre}
            onChange={(e) => {
              setFormData({...formData, nombre: e.target.value});
              setErrorNombre(""); // Limpiar el error si el usuario ingresa el nombre
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          {errorNombre && (
            <p style={{color: "red", marginTop: 5}}>
              {errorNombre}
            </p>
          )}          
        </div>

        {/* Campo - Descripción */}
        <div style={{ marginBottom: "1px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Descripción:
          </label>
          <textarea
            name="descripcion"
            placeholder="Descripción del evento"
            value={formData.descripcion}
            onChange={(e) => {
              setFormData({...formData, descripcion: e.target.value});
              setErrorDescripcion(""); // Limpiar el error si el usuario ingresa la descripcion
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #bbb",
              height: 20,              
              fontSize: "1rem",
            }}
          />
          {errorDescripcion && (
            <p style={{color: "red", marginTop: 5}}>
              {errorDescripcion}
            </p>
          )}
        </div>

        {/* Contenedor de Fecha y Tipo, alineados horizontalmente */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",              // espacio entre los campos                     
            marginBottom: "10px",
            alignItems: "flex-start", // alinear la parte superior
          }}
        >


              {/* Campo - Fecha */}
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
                  Fecha del Evento:
                </label>
                <input
                  type="date"
                  name="fecha_evento"
                  value={formData.fecha_evento}
                  onChange={(e) => {
                    setFormData({...formData, fecha_evento: e.target.value});
                    setErrorFecha(""); // Limpiar el error si el usuario selecciona fecha
                  }}
                  style={{
                    width: "50%",
                    padding: "6px",
                    borderRadius: 10,
                    border: "1px solid #bbb",
                    fontSize: "0.9rem",
                  }}
                />
                {errorFecha && (
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errorFecha}
                  </p>
                )}
              </div>

              {/* Campo - Tipo */}
              <div style={{ flex: 3 }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  style={{
                    width: "99%",
                    padding: "6px",
                    borderRadius: 10,
                    border: "1px solid #bbb",
                    fontSize: "1rem",
                  }}
                >
                  <option value='Otro' >Otro</option>
                  <option value='Baile' >Baile</option>
                  <option value='Deporte' >Deporte</option>
                  <option value='Académico' >Académico</option>
                  <option value='Literario' >Literario</option>                  
                </select>
              </div>
        </div>

        {/* Campo - Lugar */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Lugar:
          </label>
          <input
            name="lugar"
            placeholder="Lugar donde se lleva a cabo el evento"
            value={formData.lugar}
            onChange={(e) => {
              setFormData({...formData, lugar: e.target.value});
              setErrorLugar(""); // Limpiar el error si el usuario ingresalugar
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #bbb",
              fontSize: "1rem",
            }}
          />
          {errorLugar && (
            <p style={{ color: "red", marginTop: 5 }}>
              {errorLugar}
            </p>
          )}          
        </div>

        {/* Campo - Estado */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Estado:
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            style={{
              width: "20%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #bbb",
              fontSize: "1rem",
            }}
          >
            <option value="ACT">Activo</option>
            <option value="INA">Inactivo</option>
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <button
            onClick={guardarEvento}
            style={{
              padding: "10px",
              width: "20%",
              alignContent: "center",
              background: editando ? "#28a745" : "#007bff",
              color: "white",
              border: "none",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: 10,
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {editando ? "Actualizar" : "Crear Evento"}
          </button>
        </div>
      </div>

      {/* Tabla de eventos */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 20,
          background: "white",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lugar</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e) => (
            <tr key={e.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.lugar}</td>
              <td>{e.estado}</td>
              <td>
                <button onClick={() => editar(e)}>Editar</button>
                <button
                  onClick={() => eliminar(e.id!)}
                  style={{ marginLeft: 10, color: "red" }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
