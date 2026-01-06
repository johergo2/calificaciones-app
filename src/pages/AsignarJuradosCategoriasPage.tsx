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
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([]);

  const [cedula, setCedula] = useState("");
  const [eventoId, setEventoId] = useState<number | "">("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);

//  const [mensajeOk, setMensajeOk] = useState("");
const [mostrarPopup, setMostrarPopup] = useState(false);
const [popupMensaje, setPopupMensaje] = useState("");

// Usuario que inicia sesión viene de LoginPage.tsx
const usuarioId = Number(localStorage.getItem("usuarioId"));
console.log("usuarioId:", usuarioId);
const usuarioNombre = localStorage.getItem("usuarioNombre") ?? "Usuario";  
console.log("usuarioNombre:", usuarioNombre); 


  /* ===============================
     Tabla
  ================================ */
  const [tabla, setTabla] = useState<JuradoCategoriaEvento[]>([]);
  const [eventoFiltroId, setEventoFiltroId] = useState<number | "">("");
  const [loadingTabla, setLoadingTabla] = useState(false);

  /* ===============================
     Carga inicial
  ================================ */
  useEffect(() => {
    cargarDatos();
    //cargarTabla();
    cargarTabla(eventoFiltroId === "" ? undefined : eventoFiltroId, usuarioId);
  }, [eventoFiltroId]);

  const cargarDatos = async () => {
    setJurados(await getJurados());
    setEventos(await getEventos(usuarioId));
    setCategorias(await getCategorias());
  };

  /* ===============================
     Cargar categorías asignadas
  ================================ */
  useEffect(() => {
    if (!cedula || !eventoId) {
      setCategoriasSeleccionadas([]);
      return;
    }

    cargarCategoriasAsignadas();
  }, [cedula, eventoId]);

  const cargarCategoriasAsignadas = async () => {
    const data = await getCategoriasPorJuradoEvento(cedula, eventoId as number);
    setCategoriasSeleccionadas(data.map((c: Categorias) => c.id));
  };

  /* ===============================
     Checkbox
  ================================ */
  const toggleCategoria = (id: number) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

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
        categorias: categoriasSeleccionadas,
      });

      setPopupMensaje("✔️ Jurados asignadas correctamente");
      setMostrarPopup(true);

      cargarTabla(eventoFiltroId || undefined, usuarioId);

    } catch (error) {
      setPopupMensaje("❌ Error al asignar Jurados");
      setMostrarPopup(true);
    }
    //setTimeout(() => setMensajeOk(""), 4000);
  };

  /* ===============================
     Tabla
  ================================ */
  const cargarTabla = async (eventoId?: number, usuarioId?: number) => {
    try {
      setLoadingTabla(true);
      const data = await getJuradosCategoriasEventos({eventoId, usuarioId});
      console.log("TABLA BACKEND →", data);
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
    cargarTabla(eventoFiltroId || undefined, usuarioId);
    cargarCategoriasAsignadas();
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
  marginLeft: "20px"
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
    <div style={{ width: "90vw", padding: 20, background: "#f1f5f9", 
                  minHeight: "100vh", position: "relative" }}>

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
        🎓 ASIGNAR JURADOS A EVENTOS Y CATEGORÍAS
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

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/EstructuraEventos")}
                  style={{
                    background: "#007bff",
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "7px 32px",
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
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
        }}
      >        
        {/* Jurado */}
        <label>Jurado:</label>
        <select value={cedula} onChange={e => setCedula(e.target.value)}
                  style={selectStyle}          
        >
          <option value="">-- Seleccione --</option>
          {jurados.map(p => (
            <option key={p.cedula} value={p.cedula}>
              {p.cedula} - {p.nombre}
            </option>
          ))}
        </select>

        {/* Evento */}
        <label style={{marginLeft: "30px"}}>Evento:</label>
        <select
          value={eventoId}
          onChange={e => setEventoId(e.target.value ? Number(e.target.value) : "")}
                  style={selectStyle}          
        >
          <option value="">-- Seleccione --</option>
          {eventos.map(e => (
            <option key={e.id} value={e.id}>
              {e.id} - {e.nombre}
            </option>
          ))}
        </select>

        {/* Categorías */}
        <div style={{ marginTop: 10 }}>
          <strong>Categorías</strong>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px 20px",
              marginTop: 10,
            }}
          >

            {categorias.map(c => (
              <label
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}              
              >
                <input
                  type="checkbox"
                  checked={categoriasSeleccionadas.includes(c.id)}
                  onChange={() => toggleCategoria(c.id)}
                  style={{ marginRight: 6 }}
                />
                  {c.categoria}
              </label>              
            ))}
          </div>
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
          cargarTabla(eventoFiltroId, usuarioId);
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
                    🗑️
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
