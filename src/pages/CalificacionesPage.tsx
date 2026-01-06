import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJurados } from "../services/juradosApi";
import { getEventos } from "../services/eventosApi";
import { getCategorias } from "../services/categoriasApi";
import { getJuradosCategoriasEventos } from "../services/juradosCategoriasApi";
import { getParticipantesCategoriasEventos } from "../services/participantesCategoriasApi";
import { getCalificacionestot, crearCalificacion } from "../services/calificacionesApi";

import type { Evento } from "../services/eventosApi";
import type { Categorias } from "../services/categoriasApi";
import type { Jurado } from "../services/juradosApi"
//import type { Participante } from "../services/participantesApi"
import type { ParticipanteCategoriaEvento } from "../services/participantesCategoriasApi";
import type { CalificacionTot } from "../services/calificacionesApi";


export default function CalificacionesPage() {
  const navigate = useNavigate();

  /* ===============================
     Estados base
  ================================ */
  //const [, setJurados] = useState<Jurado[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([]);

  const [juradosAsignados, setJuradosAsignados] = useState<Jurado[]>([]);
  const [asignaciones, setAsignaciones] = useState<any[]>([]);
  const [eventosPorJurado, setEventosPorJurado] = useState<Evento[]>([]);
  const [categoriasPorEvento, setCategoriasPorEvento] = useState<Categorias[]>([]);
  const [eventoId] = useState<number | "">("");
  const [participantes, setParticipantes] = useState<ParticipanteCategoriaEvento[]>([]);

  
  const [calificaciones, setCalificaciones] = useState<CalificacionTot[]>([]);  
  const [eventoFiltroId, setEventoFiltroId] = useState<number | "">("");
  //const [loading, setLoading] = useState(false);
  const [loadingTabla, setLoadingTabla] = useState(false);

  // Usuario que inicia sesión viene de LoginPage.tsx
  const usuarioId = Number(localStorage.getItem("usuarioId"));
  const usuarioNombre = localStorage.getItem("usuarioNombre") ?? "Usuario";
  console.log("usuarioId:", usuarioId);
  console.log("usuarioNombre:", usuarioNombre); 

  /* ===============================
     Formulario
  ================================ */
  const [formData, setFormData] = useState({
    cedula_jurado: "",
    evento_id: "",
    categoria_id: "",
    cedula_participan: "",
    puntaje: "" as number | "",
  });

  /* ===============================
     Popup
  ================================ */
  const [popupMensaje, setPopupMensaje] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);

  /* ===============================
     Carga inicial
  ================================ */
  useEffect(() => {
    cargarDatosIniciales();
  }, []);


  useEffect(() => {
    if (!usuarioId) return;

      cargarCalificaciones(eventoFiltroId === "" ? undefined : eventoFiltroId, usuarioId);
    }, [eventoFiltroId, usuarioId]);


  const cargarDatosIniciales = async () => {
    try {
      const eventoIdParam =
      eventoId === "" ? undefined : Number(eventoId);    

      const [juradosData, eventosData, categoriasData, asignacionesData]: [
        Jurado[],
        Evento[],
        Categorias[],
        ParticipanteCategoriaEvento[]        
      ] =
        await Promise.all([
          getJurados(),
          getEventos(usuarioId),
          getCategorias(),
          getJuradosCategoriasEventos({eventoId: eventoIdParam, usuarioId}),
        ]);

        //setJurados(juradosData);
        setEventos(eventosData);
        setCategorias(categoriasData);        
        setAsignaciones(asignacionesData);        

        const cedulasUnicas = Array.from(
          new Set(asignacionesData.map(a => a.cedula))
        );

        setJuradosAsignados(
          juradosData.filter(j => cedulasUnicas.includes(j.cedula))
        );

    } catch (error) {
        console.error("Error carga inicial:", error);
    }
  };

  const cargarCalificaciones = async (eventoId?: number, usuarioId?: number) => {
    try {
      setLoadingTabla(true);
      const response = await getCalificacionestot(eventoId, usuarioId);
      setCalificaciones(response.calificacionestot);
    } finally {
      setLoadingTabla(false);
    }
  };



  /* ===============================
     Dependencias
  ================================ */
  const cargarEventosPorJurado = async (cedula: string) => {
    setEventosPorJurado([]);
    setCategoriasPorEvento([]);
    setParticipantes([]);

    if (!cedula) return;
    
    const eventosIds = Array.from(
      new Set(asignaciones.filter(a => a.cedula === cedula).map(a => a.evento_id))
    );

    setEventosPorJurado(eventos.filter(e => e.id && eventosIds.includes(e.id)));
  };

  const cargarCategoriasPorEvento = async (cedula: string, eventoId: number) => {
    setCategoriasPorEvento([]);
    setParticipantes([]);

    
    const categoriasIds = Array.from(
      new Set(
        asignaciones
          .filter(a => a.cedula === cedula && a.evento_id === eventoId)
          .map(a => a.categoria_id)
      )
    );

    setCategoriasPorEvento(
      categorias.filter(c => c.id && categoriasIds.includes(c.id))
    );
  };

  const cargarParticipantes = async (eventoId: number, 
                                     categoriaId: number, 
                                     usuarioId: number) => {
    const data: ParticipanteCategoriaEvento[] = await getParticipantesCategoriasEventos({
      eventoId,
      usuarioId,
    });

    const filtrados = data.filter(
      p => p.evento_id === eventoId && p.categoria_id === categoriaId
    );

    // Eliminar duplicados por cédula
    const participantesUnicos = Array.from(
      new Map(filtrados.map(p => [p.cedula, p])).values()
    );

    setParticipantes(participantesUnicos);
  };

  /* ===============================
     Guardar Calificación
  ================================ */
  const guardarCalificacion = async () => {
    const { cedula_jurado, evento_id, categoria_id, cedula_participan, puntaje } = formData;

    if (!cedula_jurado || !evento_id || !categoria_id || !cedula_participan || puntaje === "" || isNaN(puntaje)) {
      setPopupMensaje("Debe completar todos los campos con valores válidos");
      setMostrarPopup(true);
      return;
    }

    try {
      console.log("Payload enviado:", {
        cedula_jurado,
        cedula_participan,
        evento_id: Number(evento_id),
        categoria_id: Number(categoria_id),
        puntaje: Number(puntaje),
      });

      await crearCalificacion({
        cedula_jurado,
        cedula_participan,
        evento_id: Number(evento_id),
        categoria_id: Number(categoria_id),
        puntaje: Number(puntaje),
      });

      setPopupMensaje("✅ Calificación registrada correctamente");
      setMostrarPopup(true);

      setFormData({ ...formData, cedula_participan: "", puntaje: "" });

    } catch (error: any) {
        if (error?.response?.status === 409) {
          setPopupMensaje("⚠️ El participante ya tiene una calificación registrada");
        } else {
          console.error("Error API:", error?.response?.data || error);
          setPopupMensaje("❌ Error al guardar la calificación");
        }      
      setMostrarPopup(true);
    }
  };

  /*********************************************
  * Propiedades para los campos del formulario
   *********************************************/  
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

  const filaStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
    flexWrap: "wrap",
  };

  const labelStyle: React.CSSProperties = {
    minWidth: 120,
    fontWeight: "bold",
    color: "#1E293B",
    //marginLeft: "30px",
  };

  const campoStyle: React.CSSProperties = {
    flex: 1,               // ocupa el resto del espacio
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    fontSize: "0.9rem",
  };

  const selectStyle: React.CSSProperties = {
    fontSize: "0.9rem",
    padding: "4px 12px",
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    //marginLeft: "20px"
  };  

  const thStyle: React.CSSProperties = {
    padding: "12px 14px",
    fontSize: "0.85rem",
    fontWeight: 600,
    textTransform: "uppercase",
    borderBottom: "2px solid #1005a7ff",
    borderRight: "1px solid #E5E7EB",
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: "0.8rem",
    color: "#374151",
    whiteSpace: "nowrap",
    borderRight: "1px solid #9db9f1ff",
  };

  /* ===============================
     Render
  ================================ */
  return (
    <div style={{ width: "90vw", padding: 20, background: "#f1f5f9", minHeight: "100vh" }}>

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

      <h2 style={{ textAlign: "center", color: "#1E40AF", fontWeight: 700, letterSpacing: "0.5PX" }}>
        👑 CALIFICAR PARTICIPANTES
      </h2>

      <div
        style={{
          position: "absolute",
          top: 45,
          left: 35,
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

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/MenuCalificacionesPage")}
                  style={{
                    background: "#007bff",
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "6px 32px",
                    //height: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                    transition: "all 0.2s",
                  }}                    
        >          
          ⬅ Regresar</button>
      </div>

      {/* ===============================
         FORMULARIO
      ================================ */}      

      <div         
        style={{
          marginTop: 20,
          padding: 20,
          border: "1px solid #076df3ff",
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
          flexDirection: "column",          
        }}
      >

        {/* Jurado */}
        <div style={filaStyle}>
          <label style={labelStyle}>Jurado:</label>
          <select
            value={formData.cedula_jurado}
            onChange={e => {
              setFormData({ ...formData, cedula_jurado: e.target.value, evento_id: "", categoria_id: "", cedula_participan: "" });
              cargarEventosPorJurado(e.target.value);
            }}
            style={campoStyle}
          >
            <option value="">Seleccione Jurado</option>
            {juradosAsignados.map(j => (
              <option key={j.cedula} value={j.cedula}>
                {j.cedula} - {j.nombre}
              </option>
            ))}
          </select>
        </div>


        {/* Evento */}
        <div style={filaStyle}>
          <label style={labelStyle}>Evento:</label>
          <select
            value={formData.evento_id}
            onChange={e => {
              setFormData({ ...formData, evento_id: e.target.value, categoria_id: "", cedula_participan: "" });
              cargarCategoriasPorEvento(formData.cedula_jurado, Number(e.target.value));
            }}
            style={campoStyle} 
          >
            <option value="">Seleccione Evento</option>
            {eventosPorJurado.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div style={filaStyle}>
          <label style={labelStyle}>Categoría</label>
          <select
            value={formData.categoria_id}
            onChange={e => {
              setFormData({ ...formData, categoria_id: e.target.value, cedula_participan: "" });
              cargarParticipantes(Number(formData.evento_id), Number(e.target.value), usuarioId);
            }}
            style={campoStyle}
          >
            <option value="">Seleccione Categoría</option>
            {categoriasPorEvento.map(c => (
              <option key={c.id} value={c.id}>{c.categoria}</option>
            ))}
          </select>
        </div>

        {/* Participante */}
        <div style={filaStyle}>
          <label style={labelStyle}>Participante</label>
          <select
            value={formData.cedula_participan}
            onChange={e => setFormData({ ...formData, cedula_participan: e.target.value })}
            style={campoStyle}
          >
            <option value="">Seleccione Participante</option>
            {participantes.map(p => (
              <option key={p.cedula} value={p.cedula}>
                {p.cedula} {p.participante ? `- ${p.participante}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Puntaje */}
        <div style={filaStyle}>
          <label style={labelStyle}>
             Calificación:
          </label>          
          <input
            type="number"
            inputMode="decimal"            
            placeholder="Ej: 8.75"
            step="0.1"
            min={0}
            max={100}            
            value={formData.puntaje}
            onChange={e => 
                setFormData({ ...formData, puntaje: e.target.value === "" ? "" : Number(e.target.value), })
              }            
            style={{height:"24px", borderRadius:"8px", maxWidth: 150}}
          />
        </div>
        
        <div style={{textAlign: "center", marginTop: 20}}>
          <button onClick={guardarCalificacion}
              style={{ 
                  padding: "10px 40px",
                  fontWeight: "bold",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                  transition: "all 0.2s",
              }}           
          >
            Guardar
          </button>
        </div>
      </div>   {/* FIN FORMULARIO */}

      {mostrarPopup && (
        <div>
          <p>{popupMensaje}</p>
          <button onClick={() => setMostrarPopup(false)}>Aceptar</button>
        </div>
      )}

      {/* ===============================
         TABLA
      ================================ */}
      <hr />
      <h3>Consulta</h3>

      <select
        value={eventoFiltroId}
        onChange={e =>
          setEventoFiltroId(e.target.value ? Number(e.target.value) : "")
        }
        style={selectStyle}
      >
        <option value="">Todos los eventos</option>
        {eventos.map(e => (
          <option key={e.id} value={e.id}>
            {e.nombre}
          </option>
        ))}
      </select>

      <button disabled={!usuarioId} onClick={() => 
          cargarCalificaciones(eventoFiltroId === "" ? undefined : Number(eventoFiltroId),
                               usuarioId)
        }     
            style={{ 
                padding: "7px 30px",
                fontWeight: "bold",
                background: "#007bff",
                color: "white",
                border: "none",
                margin: "20px",
                borderRadius: 8,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                transition: "all 0.2s",

            }}        
      >
        Consultar
      </button>

      {loadingTabla ? (
        <p>Cargando...</p>        
      ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
          <table           
            width="100%" 
              style={{ 
                marginTop: 20, 
                minWidth: 900,           
                borderCollapse: "collapse",
                background: "#FFFFFF",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
              }}
          >
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #007bff, #2563EB)", 
                           color: "#FFFFFF", textAlign: "center"}}>
                <th style={thStyle}>Cedula</th>
                <th style={thStyle}>Jurado</th>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Evento</th>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>No. ID</th>
                <th style={thStyle}>Participante</th>
                <th style={thStyle}>Puntaje</th>                
              </tr>
            </thead>
            <tbody>
              {calificaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                    No hay calificaciones registradas
                  </td>
                </tr>
              ) : (
                calificaciones.map((c, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{c.cedula_jurado}</td>
                    <td style={tdStyle}>{c.jurado}</td>
                    <td style={tdStyle}>{c.evento_id}</td>
                    <td style={tdStyle}>{c.evento}</td>
                    <td style={tdStyle}>{c.categoria_id}</td>
                    <td style={tdStyle}>{c.categoria}</td>
                    <td style={tdStyle}>{c.cedula_participan}</td>
                    <td style={tdStyle}>{c.participante}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{c.puntaje}</td>                  
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
      )
    }

    </div>
  );
}
