import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJurados } from "../services/juradosApi";
import { getEventos } from "../services/eventosApi";
import { getCategorias } from "../services/categoriasApi";
import { getJuradosCategoriasEventos } from "../services/juradosCategoriasApi";
import { getParticipantesCategoriasEventos } from "../services/participantesCategoriasApi";
import { crearCalificacion } from "../services/calificacionesApi";

import type { Evento } from "../services/eventosApi";
import type { Categorias } from "../services/categoriasApi";
import type { Jurado } from "../services/juradosApi"
//import type { Participante } from "../services/participantesApi"
import type { ParticipanteCategoriaEvento } from "../services/participantesCategoriasApi";

export default function CalificacionesPage() {
  const navigate = useNavigate();

  /* ===============================
     Estados base
  ================================ */
  const [jurados, setJurados] = useState<Jurado[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([]);

  const [juradosAsignados, setJuradosAsignados] = useState<Jurado[]>([]);
  const [eventosPorJurado, setEventosPorJurado] = useState<Evento[]>([]);
  const [categoriasPorEvento, setCategoriasPorEvento] = useState<Categorias[]>([]);
  const [participantes, setParticipantes] = useState<ParticipanteCategoriaEvento[]>([]);

  /* ===============================
     Formulario
  ================================ */
  const [formData, setFormData] = useState({
    cedula_jurado: "",
    evento_id: "",
    categoria_id: "",
    cedula_participante: "",
    puntaje: "",
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

  const cargarDatosIniciales = async () => {
    const [juradosData, eventosData, categoriasData, asignaciones] =
      await Promise.all([
        getJurados(),
        getEventos(),
        getCategorias(),
        getJuradosCategoriasEventos(),
      ]);

    setJurados(juradosData);
    setEventos(eventosData);
    setCategorias(categoriasData);

    const cedulasUnicas = Array.from(new Set(asignaciones.map(a => a.cedula)));
    setJuradosAsignados(juradosData.filter(j => cedulasUnicas.includes(j.cedula)));
  };

  /* ===============================
     Dependencias
  ================================ */
  const cargarEventosPorJurado = async (cedula: string) => {
    setEventosPorJurado([]);
    setCategoriasPorEvento([]);
    setParticipantes([]);

    if (!cedula) return;

    const asignaciones = await getJuradosCategoriasEventos();
    const eventosIds = Array.from(
      new Set(asignaciones.filter(a => a.cedula === cedula).map(a => a.evento_id))
    );

    setEventosPorJurado(eventos.filter(e => e.id && eventosIds.includes(e.id)));
  };

  const cargarCategoriasPorEvento = async (cedula: string, eventoId: number) => {
    setCategoriasPorEvento([]);
    setParticipantes([]);

    const asignaciones = await getJuradosCategoriasEventos();
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

  const cargarParticipantes = async (eventoId: number, categoriaId: number) => {
    const data = await getParticipantesCategoriasEventos();

    const filtrados = data.filter(
      p => p.evento_id === eventoId && p.categoria_id === categoriaId
    );

    setParticipantes(
      Array.from(new Map(filtrados.map(p => [p.cedula, p])).values())
    );
  };

  /* ===============================
     Guardar Calificación
  ================================ */
  const guardarCalificacion = async () => {
    const { cedula_jurado, evento_id, categoria_id, cedula_participante, puntaje } = formData;

    if (!cedula_jurado || !evento_id || !categoria_id || !cedula_participante || !puntaje) {
      setPopupMensaje("Debe completar todos los campos");
      setMostrarPopup(true);
      return;
    }

    try {
      await crearCalificacion({
        cedula_jurado,
        cedula_participante,
        evento_id: Number(evento_id),
        categoria_id: Number(categoria_id),
        puntaje: Number(puntaje),
      });

      setPopupMensaje("✅ Calificación registrada correctamente");
      setMostrarPopup(true);

      setFormData({ ...formData, cedula_participante: "", puntaje: "" });

    } catch {
      setPopupMensaje("❌ Error al guardar la calificación");
      setMostrarPopup(true);
    }
  };

  /* ===============================
     Render
  ================================ */
  return (
    <div style={{ padding: 20 }}>
      <h2>Calificar Participantes</h2>

      <button onClick={() => navigate("/menu")}>Volver</button>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Jurado */}
        <select
          value={formData.cedula_jurado}
          onChange={e => {
            setFormData({ ...formData, cedula_jurado: e.target.value, evento_id: "", categoria_id: "", cedula_participante: "" });
            cargarEventosPorJurado(e.target.value);
          }}
        >
          <option value="">Seleccione Jurado</option>
          {juradosAsignados.map(j => (
            <option key={j.cedula} value={j.cedula}>
              {j.cedula} - {j.nombre}
            </option>
          ))}
        </select>

        {/* Evento */}
        <select
          value={formData.evento_id}
          onChange={e => {
            setFormData({ ...formData, evento_id: e.target.value, categoria_id: "", cedula_participante: "" });
            cargarCategoriasPorEvento(formData.cedula_jurado, Number(e.target.value));
          }}
        >
          <option value="">Seleccione Evento</option>
          {eventosPorJurado.map(e => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>

        {/* Categoría */}
        <select
          value={formData.categoria_id}
          onChange={e => {
            setFormData({ ...formData, categoria_id: e.target.value, cedula_participante: "" });
            cargarParticipantes(Number(formData.evento_id), Number(e.target.value));
          }}
        >
          <option value="">Seleccione Categoría</option>
          {categoriasPorEvento.map(c => (
            <option key={c.id} value={c.id}>{c.categoria}</option>
          ))}
        </select>

        {/* Participante */}
        <select
          value={formData.cedula_participante}
          onChange={e => setFormData({ ...formData, cedula_participante: e.target.value })}
        >
          <option value="">Seleccione Participante</option>
          {participantes.map(p => (
            <option key={p.cedula} value={p.cedula}>
              {p.cedula} {p.participante ? `- ${p.participante}` : ""}
            </option>
          ))}
        </select>

        {/* Puntaje */}
        <input
          type="text"
          placeholder="Ej: 8.75"
          value={formData.puntaje}
          onChange={e => {
            if (/^\d*\.?\d*$/.test(e.target.value)) {
              setFormData({ ...formData, puntaje: e.target.value });
            }
          }}
        />

        <button onClick={guardarCalificacion}>Guardar</button>
      </div>

      {mostrarPopup && (
        <div>
          <p>{popupMensaje}</p>
          <button onClick={() => setMostrarPopup(false)}>Aceptar</button>
        </div>
      )}
    </div>
  );
}
