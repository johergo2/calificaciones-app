import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getParticipantes,
} from "../services/participantesApi";

import {
  getEventos,
} from "../services/eventosApi";

import {
  getCategorias,
} from "../services/categoriasApi";

import {
  getParticipantesCategoriasEventos,
  asignarParticipanteCategorias,
  getCategoriasPorParticipanteEvento,
  eliminarCategoriaParticipante,
} from "../services/participantesCategoriasApi";

import type {
  ParticipanteCategoriaEvento,
} from "../services/participantesCategoriasApi"

import type { Evento } from "../services/eventosApi";

import type { Categorias } from "../services/categoriasApi";

/* ===============================
   Interfaces locales
================================ */
interface Participante {
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

export default function AsignarParticipantesCategoriasPage() {
  const navigate = useNavigate();

  /* ===============================
     Estados principales
  ================================ */
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([]);

  const [cedula, setCedula] = useState("");
  const [eventoId, setEventoId] = useState<number | "">("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);

//  const [mensajeOk, setMensajeOk] = useState("");
const [mostrarPopup, setMostrarPopup] = useState(false);
const [popupMensaje, setPopupMensaje] = useState("");


  /* ===============================
     Tabla
  ================================ */
  const [tabla, setTabla] = useState<ParticipanteCategoriaEvento[]>([]);
  const [eventoFiltroId, setEventoFiltroId] = useState<number | "">("");
  const [loadingTabla, setLoadingTabla] = useState(false);

  /* ===============================
     Carga inicial
  ================================ */
  useEffect(() => {
    cargarDatos();
    //cargarTabla();
    cargarTabla(eventoFiltroId === "" ? undefined : eventoFiltroId);
  }, [eventoFiltroId]);

  const cargarDatos = async () => {
    setParticipantes(await getParticipantes());
    setEventos(await getEventos());
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
    const data = await getCategoriasPorParticipanteEvento(cedula, eventoId as number);
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
      setPopupMensaje("Debe seleccionar participante y evento");
      setMostrarPopup(true);
      return;
    }

    try {
      await asignarParticipanteCategorias({
        cedula,
        evento_id: eventoId as number,
        categorias: categoriasSeleccionadas,
      });

      setPopupMensaje("✔️ Categorías asignadas correctamente");
      setMostrarPopup(true);

      cargarTabla(eventoFiltroId || undefined);

    } catch (error) {
      setPopupMensaje("❌ Error al asignar categorías");
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
      const data = await getParticipantesCategoriasEventos(eventoId);
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

    await eliminarCategoriaParticipante(cedula, eventoId, categoriaId);
    cargarTabla(eventoFiltroId || undefined);
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

  /* ===============================
     Render
  ================================ */



  return (
    <div style={{ width: "90vw", padding: 20 }}>

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

      <h2 style={{ textAlign: "center" }}>
        ASIGNAR PARTICIPANTES A EVENTOS Y CATEGORÍAS
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/menu")}
                  style={{
                    background: "#007bff",
                    color: "white",
                    fontSize: "0.6rem",
                    //height: "15px"
                  }}                    
        >          
          ⬅ Volver</button>
      </div>

      {/* ===============================
         FORMULARIO
      ================================ */}
      
      <div
        style={{
          marginTop: 20,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 12,
          background: "#f9f9f9",
        }}
      >        
        {/* Participante */}
        <label>Participante:</label>
        <select value={cedula} onChange={e => setCedula(e.target.value)}
                  style={{                                        
                    fontSize: "0.9rem",
                    //height: "15px"
                    width: "430px",
                    margin: "15px"
                  }}          
        >
          <option value="">-- Seleccione --</option>
          {participantes.map(p => (
            <option key={p.cedula} value={p.cedula}>
              {p.cedula} - {p.nombre}
            </option>
          ))}
        </select>

        {/* Evento */}
        <label style={{marginLeft: "70px"}}>Evento:</label>
        <select
          value={eventoId}
          onChange={e => setEventoId(e.target.value ? Number(e.target.value) : "")}
                  style={{                                        
                    fontSize: "0.9rem",
                    //height: "15px"
                    width: "430px",
                    margin: "15px"
                  }}          
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
                  padding: "10px 30px",
                  fontWeight: "bold",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
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
            }}        
      >
        Consultar
      </button>

      {loadingTabla ? (
        <p>Cargando...</p>
      ) : (
        <table border={1} width="100%" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Participante</th>
              <th>Evento</th>
              <th>Categoría</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((row, i) => (
              <tr key={i}>
                <td>{row.cedula}</td>
                <td>{row.participante}</td>
                <td>{row.evento}</td>
                <td>{row.categoria}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() =>
                      eliminarCategoria(
                        row.cedula,
                        row.evento_id,
                        row.categoria_id
                      )
                    }
                  >
                    ❌
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
