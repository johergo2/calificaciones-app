import { useEffect, useState } from "react";
import type { Participante } from "../services/participantesApi";
import {
  getParticipantes,
  crearParticipante,
  actualizarParticipante,
  eliminarParticipante,
} from "../services/participantesApi";
import { useNavigate } from "react-router-dom";


export default function ParticipanPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [editando, setEditando] = useState<Participante | null>(null);

  const [formData, setFormData] = useState<Participante>({
    cedula: "",
    nombre: "",
    tipo: "",
    observacion: "",
  });

  const [errorCedula, setErrorCedula] = useState<string>("");
  const [errorNombre, setErrorNombre] = useState<string>("");
  const [errorTipo, setErrorTipo] = useState<string>("");
  const [errorObservacion, setErrorObservacion] = useState<string>("");
  const [mensajeOk, setMensajeOk] = useState<string>("")

  const navigate = useNavigate();


  const cargarParticipantes = async () => {
    const data = await getParticipantes();
    setParticipantes(data);
  };

  useEffect(() => {
    cargarParticipantes();
  }, []);

 /* const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };*/

  const guardarParticipante = async () => {
  // VALIDACIÓN: Campos obligatorios
  if (!formData.cedula || formData.cedula.trim() === "") {
    setErrorCedula("Debe ingresar una cedula - Obligatorio");
    return; // detener el guardado  
  }  
  if (!formData.nombre || formData.nombre.trim() === "") {
    setErrorNombre("Debe ingresar el nombre del particpante - Obligatorio");
    return; // detener el guardado  
  }  

     
  
    setErrorCedula(""); // limpiar error si hay cedula
    setErrorNombre(""); // limpiar error si hay nombre
    setErrorTipo(""); // limpiar error si hay tipo

    const payload = {
      cedula: formData.cedula.trim(),
      nombre: formData.nombre.trim(),
      tipo: formData.tipo === "" ? null : formData.tipo,
      observacion: formData.observacion?.trim() || "",
    };

    try {
      if (editando) {
        await actualizarParticipante(editando.id!, payload);
        setMensajeOk("✔️ Participante actualizado correctamente");
        setEditando(null);
      } else {
        await crearParticipante(payload);
        setMensajeOk("✔️ Participante creado correctamente");
      }
    
    

    // Resetear formulario
    setFormData({
      cedula: "",
      nombre: "",      
      tipo: "",
      observacion: "",      
    });

    cargarParticipantes();

    // Ocultar el mensaje después de 4 segundos
    setTimeout(() => setMensajeOk(""), 4000);

  } catch (error) {
    console.error("Error al guardar evento: ", error);
    setErrorCedula("Error al guardar participante, revisa los datos.");
    setErrorNombre("Error al guardar participante, revisa el nombre.");
    setErrorTipo("Error al guardar participante, selecciona un Tipo.");
  }

  };

  const editar = (evento: Participante) => {
    setEditando(evento);
    setFormData({
      ...evento,
      cedula: evento.cedula || "",
    });
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este participante?")) {
      await eliminarParticipante(id);
      cargarParticipantes();
    }
  };

  return (
    <div style={{ width: "90vw", margin: 0, padding: "10px", boxSizing: "border-box" }}>
      <h2 style={{ textAlign: "center", marginBottom: 2 }}>GESTIONAR PARTICIPANTES</h2>

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
          {editando ? "✏️ Editar Participante" : "📝 Crear Participante"}
        </h3>

        {/* Campo - cedula */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>Cedula del Participante:</label>
          <input
            name="cedula"
            placeholder="cedula del participante"
            value={formData.cedula}
            onChange={(e) => {
              setFormData({...formData, cedula: e.target.value});
              setErrorCedula(""); // Limpiar el error si el usuario ingresa la cedula
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          {errorCedula && (
            <p style={{color: "red", marginTop: 5}}>
              {errorCedula}
            </p>
          )}          
        </div>

        {/* Campo - Nombre */}
        <div style={{ marginBottom: "1px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Nombre del Participante:
          </label>
          <textarea
            name="nombre"
            placeholder="Nombre del participante"
            value={formData.nombre}
            onChange={(e) => {
              setFormData({...formData, nombre: e.target.value});
              setErrorNombre(""); // Limpiar el error si el usuario ingresa el nombre
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
          {errorNombre && (
            <p style={{color: "red", marginTop: 5}}>
              {errorNombre}
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
              {/* Campo - Tipo */}
              <div style={{ flex: 3 }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
                  Tipo de Participante
                </label>
                <select
                  name="tipo"
                  value={formData.tipo ?? ""}
                  onChange={(e) => {
                    // handleChange ya funciona, pero aquí lo hacemos explícito
                    setFormData({ ...formData, tipo: e.target.value });
                    setErrorTipo(""); //Limpiar el error si el usuario ingresa el tipo
                  }}
                  style={{
                    width: "20%",
                    padding: "6px",
                    borderRadius: 10,
                    border: "1px solid #bbb",
                    fontSize: "1rem",
                  }}
                >
                  <option value=""></option>
                  <option value='Individual' >Individual</option>
                  <option value='Equipo' >Equipo</option>
                  <option value='Grupo' >Grupo</option>                                    
                </select>
                {errorTipo && (
                  <p style={{color: "red", marginTop: 5}}>
                    {errorTipo}
                  </p>
                )}                
              </div>
        </div>

        {/* Campo - Observación */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Observación:
          </label>
          <textarea
            name="observacion"
            value={formData.observacion}
            onChange={ (e) => {
              setFormData({...formData, observacion: e.target.value});
              setErrorObservacion(""); //Limpiar el error si el usuario ingresa la observación
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #bbb",
              fontSize: "1rem",
            }}
          />
          {errorObservacion && (
            <p style={{color: "red", marginTop: 5}}>
              {errorObservacion}
            </p>
          )}
          
        </div>

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <button
            onClick={guardarParticipante}
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
            {editando ? "Actualizar" : "Crear Participante"}
          </button>
        </div>
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

      {/* Tabla de eventos */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 20,
          background: "white",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #141313ff", // borde externo
        }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th style={{ border: "1px solid #141313ff", padding: 8 }}>ID</th>
            <th style={{ border: "1px solid #141313ff", padding: 8 }}>Cedula</th>
            <th style={{ border: "1px solid #141313ff", padding: 8 }}>Nombre</th>
            <th style={{ border: "1px solid #141313ff", padding: 8 }}>Tipo</th>
            <th style={{ border: "1px solid #141313ff", padding: 8, width: "450px" }}>Observacion</th>
            <th style={{ border: "1px solid #141313ff", padding: 8 }}>Eventos</th>
          </tr>
        </thead>
        <tbody>
          {participantes.map((e) => (
            <tr key={e.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.id}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.cedula}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.nombre}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.tipo}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.observacion}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>
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
