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

  const [mensajeOk, setMensajeOk] = useState("");

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
  }, []);

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
      alert("Debe seleccionar participante y evento");
      return;
    }

    await asignarParticipanteCategorias({
      cedula,
      evento_id: eventoId as number,
      categorias: categoriasSeleccionadas,
    });

    setMensajeOk("✔️ Categorías asignadas correctamente");
    cargarTabla(eventoFiltroId || undefined);

    setTimeout(() => setMensajeOk(""), 4000);
  };

  /* ===============================
     Tabla
  ================================ */
  const cargarTabla = async (eventoId?: number) => {
    try {
      setLoadingTabla(true);
      const data = await getParticipantesCategoriasEventos(eventoId);
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

  /* ===============================
     Render
  ================================ */
  return (
    <div style={{ width: "90vw", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>
        ASIGNAR PARTICIPANTES A EVENTOS Y CATEGORÍAS
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/menu")}>⬅ Volver</button>
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
        {mensajeOk && <div style={{ color: "green" }}>{mensajeOk}</div>}

        {/* Participante */}
        <label>Participante:</label>
        <select value={cedula} onChange={e => setCedula(e.target.value)}>
          <option value="">-- Seleccione --</option>
          {participantes.map(p => (
            <option key={p.cedula} value={p.cedula}>
              {p.cedula} - {p.nombre}
            </option>
          ))}
        </select>

        {/* Evento */}
        <label>Evento:</label>
        <select
          value={eventoId}
          onChange={e => setEventoId(e.target.value ? Number(e.target.value) : "")}
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

        <button onClick={guardarAsignacion}>Guardar</button>
      </div>

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

      <button onClick={() => cargarTabla(eventoFiltroId || undefined)}>
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
