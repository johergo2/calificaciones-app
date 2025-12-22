import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getJurados,
} from "../services/juradosApi";

import {
  getEventos,
} from "../services/eventosApi";

import {
  getCategorias,
} from "../services/categoriasApi";

import {
  getJuradosCategoriasEventos,
  asignarJuradoCategorias,
  getCategoriasPorJuradoEvento,
  eliminarCategoriaJurado,
} from "../services/juradosCategoriasApi";

import {
  getParticipantesCategoriasEventos
} from "../services/participantesCategoriasApi";

import type {
  JuradoCategoriaEvento,
} from "../services/juradosCategoriasApi"

import type { Evento } from "../services/eventosApi";

import type { Categorias } from "../services/categoriasApi";

/* ===============================
   Interfaces locales
================================ */
interface Jurado {
  cedula: string;
  nombre: string;
}

/*interface Evento {
  id: number;
  nombre: string;
}*/

/*interface Categoria {
  id: number;
  categoria: string;
}*/

export default function AsignarJuradosCategoriasPage() {
  const navigate = useNavigate();

  /* ===============================
     Estados principales
  ================================ */
  const [jurados, setJurados] = useState<Jurado[]>([]);
  const [juradosAsignados, setJuradosAsignados] = useState<Jurado[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosPorJurado, setEventosPorJurado] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [categoriasPorJuradoEvento, setCategoriasPorJuradoEvento] = useState<Categorias[]>([]);
  const [participantesPorEventoCategoria, setParticipantesPorEventoCategoria] = useState<any[]>([]);
  const [cedulaParticipante, setCedulaParticipante] = useState("");



  const [cedula, setCedula] = useState("");
  const [eventoId, setEventoId] = useState<number | "">("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  

//  const [mensajeOk, setMensajeOk] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [popupMensaje, setPopupMensaje] = useState("");

  const [formData, setFormData] = useState({
    cedula_jurado: "",
    evento_id: "",
    categoria_id: "",
    cedula_participante: "",
    puntaje: "",
  });



  /* ===============================
     Tabla
  ================================ */
  const [tabla, setTabla] = useState<JuradoCategoriaEvento[]>([]);
  const [eventoFiltroId, setEventoFiltroId] = useState<number | "">("");
  const [loadingTabla, setLoadingTabla] = useState(false);


  const cargarJuradosAsignados = async () => {
  // 1. Traer todas las asignaciones
  const asignaciones = await getJuradosCategoriasEventos();

  // 2. Extraer cédulas únicas
  const cedulasUnicas = Array.from(
    new Set(asignaciones.map(a => a.cedula))
  );

  // 3. Filtrar jurados existentes
  const filtrados = jurados.filter(j =>
    cedulasUnicas.includes(j.cedula)
  );

  setJuradosAsignados(filtrados);
  };

/**************************
 * Función Cagar Datos
 **************************/
  const cargarDatos = async () => {
  const juradosData = await getJurados();
  setJurados(juradosData);

  setEventos(await getEventos());
  setCategorias(await getCategorias());

  // 👇 cargar jurados válidos
  const asignaciones = await getJuradosCategoriasEventos();

  const cedulasUnicas = Array.from(
    new Set(asignaciones.map(a => a.cedula))
  );

  const filtrados = juradosData.filter(j =>
    cedulasUnicas.includes(j.cedula)
  );

  setJuradosAsignados(filtrados);
};

/************************************
 * Función Carga Eventos por Jurado
 ************************************/
const cargarEventosPorJurado = async (cedulaJurado: string) => {
  if (!cedulaJurado) {
    setEventosPorJurado([]);
    return;
  }

  // Traer todas las asignaciones
  const asignaciones = await getJuradosCategoriasEventos();

  // Filtrar por jurado
  const asignacionesJurado = asignaciones.filter(
    a => a.cedula === cedulaJurado
  );

  // Extraer eventos únicos
  const eventosUnicosIds = Array.from(
    new Set(asignacionesJurado.map(a => a.evento_id))
  );

  // Filtrar eventos existentes
  const eventosFiltrados = eventos.filter(
    (e): e is Evento & { id: number } =>
      e.id !== undefined && eventosUnicosIds.includes(e.id)
  );

  setEventosPorJurado(eventosFiltrados);
};

/************************************************
 * Función Carga Categorias por Evento y Jurado
 ************************************************/
const cargarCategoriasPorJuradoEvento = async (cedulaJurado: string, eventoId: number) => {
  if (!cedulaJurado || !eventoId) {
    setCategoriasPorJuradoEvento([]);
    return;
  }

  // Traer todas las asignaciones
  const asignaciones = await getJuradosCategoriasEventos();

  // Filtrar por jurado y evento
  const asignacionesFiltradas = asignaciones.filter(
    a => a.cedula === cedulaJurado && a.evento_id === eventoId
  );

  // Extraer categorias únicas
  const categoriasIdsUnicas = Array.from(
    new Set(asignacionesFiltradas.map(a => a.categoria_id))
  );

  // Filtrar categorias existentes
  const categoriasFiltradas = categorias.filter(c =>
    categoriasIdsUnicas.includes(c.id)
  );

  setCategoriasPorJuradoEvento(categoriasFiltradas);

  };

  /****************************************************
 * Función Carga Participantes por Evento y Categoría
 ******************************************************/
  const cargarParticipantesPorEventoCategoria = async (
  eventoId: number,
  categoriaId: number
) => {
  if (!eventoId || !categoriaId) {
    setParticipantesPorEventoCategoria([]);
    return;
  }

  // Traemos todas las asignaciones
  const data = await getParticipantesCategoriasEventos();

  // Filtrar por evento y categoría
  const filtrados = data.filter(
    p => p.evento_id === eventoId && p.categoria_id === categoriaId
  );

  // Participantes únicos por cédula
  const participantesUnicos = Array.from(
    new Map(filtrados.map(p => [p.cedula, p])).values()
  );

  setParticipantesPorEventoCategoria(participantesUnicos);
};



  /* ===============================
     Carga inicial
  ================================ */
  useEffect(() => {
    cargarDatos();
    //cargarTabla();
    cargarTabla(eventoFiltroId === "" ? undefined : eventoFiltroId);
  }, [eventoFiltroId]);


  /* ===============================
     Guardar asignación
  ================================ */
  const guardarAsignacion = async () => {
    if (!cedula || !eventoId) {
      //alert("Debe seleccionar participante y evento");
      setPopupMensaje("Debe seleccionar jurado y evento");
      setMostrarPopup(true);
      return;
    }

    try {
      await asignarJuradoCategorias({
        cedula,
        evento_id: eventoId as number,
        categoria_id: categoriaId as number,
      });

      setPopupMensaje("?? Categorías asignadas correctamente");
      setMostrarPopup(true);

      cargarTabla(eventoFiltroId || undefined);

    } catch (error) {
      setPopupMensaje("? Error al asignar categorías");
      setMostrarPopup(true);
    }
    //setTimeout(() => setMensajeOk(""), 4000);
  };

  /* ===============================
     Tabla
  ================================ */
  const cargarTabla = async (eventoId?: number) => {
    try {
      setLoadingTabla(true);
      const data = await getJuradosCategoriasEventos(eventoId);
      console.log("TABLA BACKEND ?", data);
      setTabla(data);
    } finally {
      setLoadingTabla(false);
    }
  };

  /* ===============================
     Eliminar
  ================================ */
  const eliminarCategoria = async (
    cedula: string,
    eventoId: number,
    categoriaId: number
  ) => {
    if (!confirm("¿Eliminar esta asignación?")) return;

    await eliminarCategoriaJurado(cedula, eventoId, categoriaId);
    cargarTabla(eventoFiltroId || undefined);
    cargarCategoriasAsignadas();
  };

  /*********************************************
  * Propiedades para los campos del formulario
   *********************************************/

  const filaStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginTop: 12,
  };

  const labelStyle: React.CSSProperties = {
    width: 140,
    fontWeight: "bold",
    color: "#1E293B",
    marginLeft: "30px",
  };

  const campoStyle: React.CSSProperties = {
    flex: 1,               // ocupa el resto del espacio
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    fontSize: "0.9rem",
  };


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
    fontSize: "0.9rem",
    color: "#374151",
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
        CALIFICAR PARTICIPANTES
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/menu")}
                  style={{
                    background: "#007bff",
                    color: "white",
                    fontSize: "0.6rem",
                    //height: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                    transition: "all 0.2s",
                  }}                    
        >          
          ? Volver al Menú</button>
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
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >        
        {/* Jurado */}
        <div style={filaStyle}>
          <label style={labelStyle}>Jurado:</label>
          <select value={cedula} onChange={e => {const nuevaCedula = e.target.value;
                                                  setCedula(nuevaCedula);
                                                  setEventoId("");
                                                  setCategoriaId("");
                                                  setEventosPorJurado([]);
                                                  cargarEventosPorJurado(nuevaCedula);
                                                }}
                    style={campoStyle}          
          >
            <option value="">-- Seleccione --</option>
            {juradosAsignados.map(p => (
              <option key={p.cedula} value={p.cedula}>
                {p.cedula} - {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Evento */}
        <div style={filaStyle}>
          <label style={labelStyle}>Evento:</label>
          <select
            value={eventoId}
            onChange={e => {
              const nuevoEventoId = e.target.value ? Number(e.target.value) : "";
              setEventoId(nuevoEventoId);
              //Reset Categoria
              setCategoriaId("");
              setCategoriasPorJuradoEvento([]);

              if (cedula && nuevoEventoId) {
                cargarCategoriasPorJuradoEvento(cedula, nuevoEventoId);
              }
            }}
              style={campoStyle}          
          >
            <option value="">-- Seleccione Evento --</option>
            {eventosPorJurado.map(e => (
              <option key={e.id} value={e.id}>
                {e.id} - {e.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Categorías */}
        <div style={filaStyle}>
          <label style={labelStyle}>Categoría</label>
          <select
            value={categoriaId}
            onChange={e => {
                const nuevaCategoria = e.target.value ? Number(e.target.value) : "";
                setCategoriaId(nuevaCategoria);
                setParticipantesPorEventoCategoria([]);

                if (eventoId && nuevaCategoria) {
                  cargarParticipantesPorEventoCategoria(eventoId as number, nuevaCategoria);
                }
            }}
            style={campoStyle}
          >
            <option value="">-- Seleccione Categoria --</option>
            {categoriasPorJuradoEvento.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} = {c.categoria}
              </option>
            ))}
          </select>  
        </div>

        {/* Participante */}
        <div style={filaStyle}>
          <label style={labelStyle}>Participante</label>
          <select
            value={cedulaParticipante}
            onChange={e => setCedulaParticipante(e.target.value)}
            style={campoStyle}
          >
            <option value="">-- Seleccione Participante --</option>
            {participantesPorEventoCategoria.map(p => (
              <option key={p.cedula} value={p.cedula}>
                {p.cedula} {p.participante ? `- ${p.participante}` : ""}
              </option>
            ))}
          </select>
        </div>


        {/* Calificación */}
        <div style={filaStyle}>
          <label style={labelStyle}>
             Calificación:
          </label>

          <input
            type="text"
            inputMode="decimal"
            placeholder="Ej: 8.5"
            step="0.1"
            min={0}
            max={100}
            value={formData.puntaje}
            onChange={(e) => {
              const value = e.target.value;
              // Permite vacío, números y punto decimal
              if (/^\d*\.?\d*$/.test(value)) {
                setFormData({
                  ...formData,
                  puntaje: value,
                });
              }              
            }}
            style={{height:"24px", borderRadius:"8px", maxWidth: 150}}
          />
        </div>


        <div style={{textAlign: "center", marginTop: 20}}>        
          <button onClick={guardarAsignacion}
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
          >Guardar</button>
        </div>
      </div>         {/* FIN FORMULARIO */}

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

      <button onClick={() => {
        if (eventoFiltroId === ""){
          cargarTabla();
        } else{
          cargarTabla(eventoFiltroId);
        }
      }}
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
        <table 
          width="100%" 
          style={{ 
            marginTop: 20,            
            borderCollapse: "collapse",
            background: "#FFFFFF",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
          }}>
          <thead>
            <tr style={{ background: "linear-gradient(90deg, #007bff, #2563EB)", color: "#FFFFFF", textAlign: "left"}}>
              <th style={thStyle}>Cédula</th>
              <th style={thStyle}>Jurado</th>
              <th style={thStyle}>Evento</th>
              <th style={thStyle}>Categoría</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((row, i) => (
              <tr key={i} style={{background: i % 2 === 0 ? "#F9FAFB" : "#FFFFFF", borderBottom: "1px solid #E5E7EB"}}>
                <td style={tdStyle}>{row.cedula}</td>
                <td style={tdStyle}>{row.jurado}</td>
                <td style={tdStyle}>{row.evento}</td>
                <td style={tdStyle}>{row.categoria}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button
                    style={{background: "#FEE2E2", 
                            border: "1px solid #FCA5A5", 
                            color: "#DC2626", 
                            borderRadius: 6, 
                            cursor: "pointer", 
                            padding: "3px 15px",}}
                    onClick={() =>
                      eliminarCategoria(
                        row.cedula,
                        row.evento_id,
                        row.categoria_id
                      )
                    }
                  >
                    ???
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div> 
  );
}
