import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===============================
   Interfaces
================================ */
interface Evento {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  categoria: string;
}

interface EventoCategoria {
  evento_id: number;
  evento_nombre: string;
  categoria_id: number;
  categoria_nombre: string;
}

/* ===============================
   Constante API
================================ */
const API_URL = "https://api-usuarios-f1im.onrender.com/api";

export default function AsignarCategoriasPage() {
  const navigate = useNavigate();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [eventoId, setEventoId] = useState<number | "">("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);


  //Mostrar popup al guardar
  //const [mensajeOk, setMensajeOk] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [popupMensaje, setPopupMensaje] = useState("");

  // Usuario que inicia sesión viene de LoginPage.tsx
  const usuarioId = Number(localStorage.getItem("usuarioId"));
  const usuarioNombre = localStorage.getItem("usuarioNombre") ?? "Usuario";  
  console.log("usuarioId:", usuarioId);
  console.log("usuarioNombre:", usuarioNombre); 

  /* Tabla inferior */
  const [tablaEventoCategorias, setTablaEventoCategorias] = useState<EventoCategoria[]>([]);
  const [eventoFiltroId, setEventoFiltroId] = useState<number | "">("");
  const [loadingTabla, setLoadingTabla] = useState(false);

  /* ===============================
     Cargar eventos y categorías
================================ */
  useEffect(() => {
    cargarEventos(usuarioId);
    cargarCategorias();
  }, []);

  const cargarEventos = async (usuarioId: number) => {
    try {
      const res = await fetch(`${API_URL}/eventos?usuario_id=${usuarioId}`);
      
      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      const data = await res.json();

       console.log("RESPUESTA EVENTOS:", data); // 👈 AGREGA ESTO

      setEventos(data.eventos || []);
    } catch (error) {
      console.error("Error cargando eventos", error);
      setEventos([]);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/categorias`);
      const data = await res.json();
      setCategorias(data.categorias || []);
    } catch (error) {
      console.error("Error cargando categorías", error);
      setCategorias([]);
    }
  };

  /* ===============================
     Cargar categorías asignadas
================================ */
  useEffect(() => {
    if (!eventoId) {
      setCategoriasSeleccionadas([]);
      return;
    }
    cargarCategoriasAsignadas(eventoId);
  }, [eventoId]);

  const cargarCategoriasAsignadas = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/eventos/${id}/categorias`);
      const data = await res.json();
      setCategoriasSeleccionadas(
        (data.categorias || []).map((c: Categoria) => c.id)
      );
    } catch (error) {
      console.error("Error cargando categorías asignadas", error);
      setCategoriasSeleccionadas([]);
    }
  };

  /* ===============================
     Manejo checkbox
================================ */
  const toggleCategoria = (categoriaId: number) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoriaId)
        ? prev.filter((id) => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  /* ===============================
     Guardar asignación
================================ */
  const guardarAsignacion = async () => {
    if (!eventoId) {
      //alert("Debe seleccionar un evento");
      setPopupMensaje("Debe seleccionar participante y evento");
      setMostrarPopup(true);      
      return;
    }

    try {
      const res = await fetch(`${API_URL}/eventos/${eventoId}/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorias: categoriasSeleccionadas }),
      });

      if (!res.ok) throw new Error();

      //setMensajeOk("✔️ Categorías asignadas correctamente");
      setPopupMensaje("✔️ Categorías asignadas correctamente");
      setMostrarPopup(true);      

      cargarTablaEventoCategorias(eventoFiltroId || undefined);

      //setTimeout(() => setMensajeOk(""), 4000);
    } catch {
      //alert("Error guardando categorías");
      setPopupMensaje("❌ Error al asignar categorías");
      setMostrarPopup(true);
    }
  };

  /* ===============================
     Eliminar categoría
================================ */
  const eliminarCategoria = async (eventoId: number, categoriaId: number) => {
    if (!confirm("¿Eliminar esta categoría del evento?")) return;

    await fetch(
      `${API_URL}/eventos/${eventoId}/categorias/${categoriaId}`,
      { method: "DELETE" }
    );

    cargarCategoriasAsignadas(eventoId);
    cargarTablaEventoCategorias(eventoFiltroId || undefined);
  };

  /* ===============================
     Tabla inferior
  ================================ */
  const cargarTablaEventoCategorias = async (eventoId?: number) => {
    try {
      setLoadingTabla(true);
      setTablaEventoCategorias([]);

      const eventosFiltrados = eventoId
        ? eventos.filter(e => e.id === eventoId)
        : eventos;

      const filas: EventoCategoria[] = [];

      for (const evento of eventosFiltrados) {
        const res = await fetch(`${API_URL}/eventos/${evento.id}/categorias?usuario_id=${usuarioId}`);

        if (!res.ok) {
          console.error("Error consultando categorías del evento", evento.id);
          continue;
        }

        const data = await res.json();

        (data.categorias || []).forEach((c: Categoria) => {
          filas.push({
            evento_id: evento.id,
            evento_nombre: evento.nombre,
            categoria_id: c.id,
            categoria_nombre: c.categoria
          });
        });
      }

      setTablaEventoCategorias(filas);
    } catch (error) {
      console.error("Error cargando tabla", error);
    } finally {
      setLoadingTabla(false);
    }
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

      <h2 style={{ textAlign: "center", color: "#1E40AF", fontWeight: 700, 
                   letterSpacing: "0.5PX" 
                  }}>🧩 ASIGNAR CATEGORÍAS A EVENTOS
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
                    //height: "15px",
                    cursor: "pointer",
                    padding: "8px 32px",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                    transition: "all 0.2s",
                  }}        
        >⬅ Regresar
        </button>
      </div>

      {/* ==================================================
          MARCO ASIGNACIÓN (SOLO PRESENTACIÓN)
      ================================================== */}
      <div
        style={{
          border: "1px solid #076df3ff",
          borderRadius: 16,
          padding: 20,
          marginTop: 20,
          background: "#ffffff",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
        }}
      >


  
        {/* Selección evento */}
        <div style={{ marginTop: 20 }}>
          <label><strong>Evento:</strong></label>
          <select
            value={eventoId}
            onChange={(e) => setEventoId(e.target.value ? Number(e.target.value) : "")}
            style={selectStyle}
          >
            <option value="">-- Seleccione un evento --</option>
            {eventos.map(e => (
              <option key={e.id} value={e.id}>
                {e.id} - {e.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Categorías */}
        <div style={{ marginTop: 5 }}>
          <strong>Categorías:</strong>
          
          <div
            style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px 20 px",
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

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button onClick={guardarAsignacion} 
            style={{ 
                padding: "10px 30px",
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
            Guardar Categorías
          </button>
        </div>
      </div>

      {/* Filtro */}
      <hr />
      <h3>Consultar eventos</h3>

      <select
        value={eventoFiltroId}
        onChange={(e) => setEventoFiltroId(e.target.value ? Number(e.target.value) : "")}
        style={selectStyle}
      >
        <option value="">Todos los eventos</option>
        {eventos.map(e => (
          <option key={e.id} value={e.id}>
            {e.id} - {e.nombre}
          </option>
        ))}
      </select>

      <button onClick={() => cargarTablaEventoCategorias(eventoFiltroId || undefined)}
        style={{
            padding: "5px 30px",
            fontWeight: "bold",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 8,     
            margin: "20px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
            transition: "all 0.2s",  
        }}
      >
        Consultar
      </button>

      {/* Tabla */}
      <div style={{ marginTop: 20 }}>
        {loadingTabla ? (
          <p>Cargando...</p>
        ) : (
          <table width="100%"
          style={{
            marginTop: 20,            
            borderCollapse: "collapse",
            background: "#FFFFFF",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
          }}>
            <thead>
              <tr style={{background: "linear-gradient(90deg, #007bff, #2563EB)", color: "#FFFFFF", textAlign: "left"}}>
                <th style={thStyle}>ID Evento</th>
                <th style={thStyle}>Evento</th>
                <th style={thStyle}>Categoría</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {tablaEventoCategorias.map((row, i) => (
                <tr key={i}
                style={{background: i % 2 === 0 ? "#F9FAFB" : "#FFFFFF", borderBottom: "1px solid #E5E7EB"}}>
                  <td style={tdStyle}>{row.evento_id}</td>
                  <td style={tdStyle}>{row.evento_nombre}</td>
                  <td style={tdStyle}>{row.categoria_nombre}</td>
                  <td style={{ ...tdStyle, textAlign: "center"}}>
                    <button
                      style={{ color: "red", 
                               background: "#FEE2E2", 
                               padding: "1px 15px", 
                               border: "1px solid #FCA5A5",
                               borderRadius: 6,
                               cursor: "pointer",                               
                               boxShadow: "0 2px 4px #4f555cff, 0 6px 10px rgba(0,0,0,0.2)"
                              }}
                      onClick={() =>
                        eliminarCategoria(row.evento_id, row.categoria_id)
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
    </div>
  );
}
