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
  const [mensajeOk, setMensajeOk] = useState("");

  /* Tabla inferior */
  const [tablaEventoCategorias, setTablaEventoCategorias] = useState<EventoCategoria[]>([]);
  const [eventoFiltroId, setEventoFiltroId] = useState<number | "">("");
  const [loadingTabla, setLoadingTabla] = useState(false);

  /* ===============================
     Cargar eventos y categorías
================================ */
  useEffect(() => {
    cargarEventos();
    cargarCategorias();
  }, []);

  const cargarEventos = async () => {
    try {
      const res = await fetch(`${API_URL}/eventos`);
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
      alert("Debe seleccionar un evento");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/eventos/${eventoId}/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorias: categoriasSeleccionadas }),
      });

      if (!res.ok) throw new Error();

      setMensajeOk("✔️ Categorías asignadas correctamente");
      cargarTablaEventoCategorias(eventoFiltroId || undefined);

      setTimeout(() => setMensajeOk(""), 4000);
    } catch {
      alert("Error guardando categorías");
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
        const res = await fetch(`${API_URL}/eventos/${evento.id}/categorias`);
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

  /* ===============================
     Render
================================ */
  return (
    <div style={{ width: "90vw", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>ASIGNAR CATEGORÍAS A EVENTOS</h2>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
       <button onClick={() => navigate("/menu")}
                  style={{
                    background: "#007bff",
                    color: "white",
                    fontSize: "0.6rem",
                    //height: "15px"
                  }}        
        >⬅ Volver al Menú
        </button>
      </div>

      {/* ==================================================
          MARCO ASIGNACIÓN (SOLO PRESENTACIÓN)
      ================================================== */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 10,
          padding: 20,
          marginTop: 20,
          background: "#f9f9f9",
        }}
      >

        {mensajeOk && (
          <div style={{ background: "#d4edda", padding: 10, marginTop: 10 }}>
            {mensajeOk}
          </div>
        )}
  
        {/* Selección evento */}
        <div style={{ marginTop: 20 }}>
          <label><strong>Evento:</strong></label>
          <select
            value={eventoId}
            onChange={(e) => setEventoId(e.target.value ? Number(e.target.value) : "")}
            style={{ width: "100%", padding: 8 }}
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
        <div style={{ marginTop: 20 }}>
          <strong>Categorías:</strong>
          {categorias.map(c => (
            <div key={c.id}>
              <input
                type="checkbox"
                checked={categoriasSeleccionadas.includes(c.id)}
                onChange={() => toggleCategoria(c.id)}
              />{" "}
              {c.categoria}
            </div>
          ))}
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
            margin: "20px"     
        }}
      >
        Consultar
      </button>

      {/* Tabla */}
      <div style={{ marginTop: 20 }}>
        {loadingTabla ? (
          <p>Cargando...</p>
        ) : (
          <table border={1} width="100%">
            <thead>
              <tr>
                <th>ID Evento</th>
                <th>Evento</th>
                <th>Categoría</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {tablaEventoCategorias.map((row, i) => (
                <tr key={i}>
                  <td>{row.evento_id}</td>
                  <td>{row.evento_nombre}</td>
                  <td>{row.categoria_nombre}</td>
                  <td style={{ textAlign: "center"}}>
                    <button
                      style={{ color: "red", 
                               background: "#bbc2caff", 
                               padding: "1px 15px", 
                               border: "1px solid #59636eff",
                               borderRadius: "6px",
                               boxShadow: "0 2px 4px #4f555cff, 0 6px 10px rgba(0,0,0,0.2)"
                              }}
                      onClick={() =>
                        eliminarCategoria(row.evento_id, row.categoria_id)
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
    </div>
  );
}
