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

  //const [mensajeOk, setMensajeOk] = useState<string>("")
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [popupMensaje, setPopupMensaje] = useState("");

  // Usuario que inicia sesión viene de LoginPage.tsx
  const usuarioNombre = localStorage.getItem("usuarioNombre") ?? "Usuario";
  console.log("usuarioNombre:", usuarioNombre);  

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
        //setMensajeOk("✔️ Participante actualizado correctamente");
        setPopupMensaje("✔️ Participante actualizado correctamente");
        setMostrarPopup(true);
        setEditando(null);
      } else {
        await crearParticipante(payload);
        //setMensajeOk("✔️ Participante creado correctamente");
        setPopupMensaje("✔️ Participante creado correctamente");
        setMostrarPopup(true);
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
    //setTimeout(() => setMensajeOk(""), 4000);

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

  //Estilos para popup
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: "25px 40px",
  borderRadius: 10,
  textAlign: "center",
  minWidth: 300,
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};

const botonCerrarStyle: React.CSSProperties = {
  marginTop: 15,
  padding: "8px 20px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};   

// Estilos para tabla inferior
  const thStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: "0.85rem",
  fontWeight: 600,
  textTransform: "uppercase",
  borderBottom: "2px solid #1005a7ff",
  borderRight: "1px solid #E5E7EB",
};

  return (
    <div style={{ width: "90vw", padding: 20, background: "#f1f5f9", 
                  minHeight: "100vh", position: "relative" }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF", 
                   fontWeight: 700, letterSpacing: "0.5PX" 
                  }}>🧑‍🤝‍🧑 GESTIONAR PARTICIPANTES
      </h2>

      <div
        style={{
          position: "absolute",
          top: 15,
          left: 25,
          fontWeight: 600,
          fontSize: "0.75rem",
          fontStyle: "italic",
          color: "#1E40AF",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        👤 {usuarioNombre}
      </div>

      {/* Botón regresar al menú */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button
          onClick={() => navigate("/DatosBasicos")}
          style={{
            padding: "8px 32px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.7rem",
            alignItems: "rigth",
          }}
        >
          ⬅ Regresar
        </button>
      </div>

      {mostrarPopup && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <p>{popupMensaje}</p>
            <button
              onClick={() => setMostrarPopup(false)}
              style={botonCerrarStyle}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          border: "1px solid #076df3ff",
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
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


      {/* Tabla de eventos */}
      <table
        width="100%" 
        style={{
            marginTop: 20,            
            borderCollapse: "collapse",
            background: "#FFFFFF",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            tableLayout: "fixed",
            textOverflow: "ellipsis", 
            fontSize: "0.8rem",
        }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr style={{ background: "linear-gradient(90deg, #007bff, #2563EB)", color: "#FFFFFF", textAlign: "left"}}>
            <th style={{ ...thStyle, width: "5%"}}>ID</th>
            <th style={{ ...thStyle, width: "10%"}}>Cedula</th>
            <th style={{ ...thStyle, width: "33%"}}>Nombre</th>
            <th style={{ ...thStyle, width: "10%"}}>Tipo</th>
            <th style={{ ...thStyle, width: "30%"}}>Observacion</th>
            <th style={{ ...thStyle, width: "12%"}}>Eventos</th>
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
                <button 
                  style={{ 
                    marginLeft: 10, 
                    padding: "4px 15px",
                    background: "#bbc2caff", 
                    border: "1px solid #59636eff",
                    boxShadow: "0 2px 4px #4f555cff, 0 6px 10px rgba(0,0,0,0.2)",
                    color: "red" 
                  }}                
                  onClick={() => editar(e)}>
                    📝
                </button>
                <button
                  onClick={() => eliminar(e.id!)}                  
                  style={{ 
                    marginLeft: 10, 
                    padding: "4px 15px",
                    background: "#bbc2caff", 
                    border: "1px solid #59636eff",
                    boxShadow: "0 2px 4px #4f555cff, 0 6px 10px rgba(0,0,0,0.2)",
                    color: "red"                   
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
