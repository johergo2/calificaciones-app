import { useEffect, useState } from "react";
import {
  getUsuarios,
  getUsuariosEventos,
  crearUsuarioEvento,
} from "../services/api";

import {
  getEventos
} from "../services/eventosApi";

import type { Usuario, UsuarioEvento } from "../services/api";

import type { Evento } from "../services/eventosApi";

export default function UsuariosEventosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [usuariosEventos, setUsuariosEventos] = useState<UsuarioEvento[]>([]);

  const [usuarioIdSeleccionado, setUsuarioId] = useState<number | null>(null);
  const [eventoId, setEventoId] = useState<number | "">("");

  const [mensaje, setMensaje] = useState<string>("");

  // Usuario que inicia sesión viene de LoginPage.tsx
  const usuarioId = Number(localStorage.getItem("usuarioId"));
  console.log("usuarioId:", usuarioId);
  const usuarioNombre = localStorage.getItem("usuarioNombre") ?? "Usuario";
  console.log("usuarioNombre:", usuarioNombre);    
  

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setUsuarios(await getUsuarios());
    setEventos(await getEventos(usuarioId));
    setUsuariosEventos(await getUsuariosEventos());
  };

  const asociarEvento = async () => {
    if (!usuarioIdSeleccionado || !eventoId) {
      setMensaje("Debe seleccionar un usuario y un evento");
      return;
    }

    try {
      await crearUsuarioEvento({
        usuario_id: String(usuarioIdSeleccionado),
        evento_id: String(eventoId),
      });

      setMensaje("✔️ Evento asociado correctamente");
      setUsuarioId(null);
      setEventoId("");
      cargarDatos();
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al asociar evento");
    }
  };

  const obtenerNombreUsuario = (id: number) =>
    usuarios.find(u => u.id === id)?.nombre || "—";

  const obtenerNombreEvento = (id: number) =>
    eventos.find(e => e.id === id)?.nombre || "—";

  return (
    <div style={{ width: "100vw", padding: 20, background: "#f1f5f9", 
                  minHeight: "100vh",  border: "3px solid green", boxSizing: "border-box",
                   }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF" }}>
        🔗 Asociación Usuarios - Eventos
      </h2>

      {/* FORMULARIO */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          width: "100%",          
          border: "1px solid #076df3ff",        
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
        }}
      >
        <h3 style={{ textAlign: "center", color: "#1E40AF", 
                  fontWeight: 700, letterSpacing: "0.5PX" 
                  }}>Asociar Evento a Usuario
        </h3>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>Usuario:</label>
          <select
            value={usuarioIdSeleccionado ?? ""}
            onChange={(e) => setUsuarioId(e.target.value ? parseInt(e.target.value, 10) : null)}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          >
            <option value="">-- Seleccione usuario --</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>Evento:</label>
          <select
            value={eventoId}
            onChange={(e) => setEventoId(Number(e.target.value))}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          >
            <option value="">-- Seleccione evento --</option>
            {eventos.map(e => (
              <option key={e.id} value={e.id}>
                {e.nombre} | {e.fecha_evento}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <button
            onClick={asociarEvento}
            style={{
              width: "20%",
              padding: "10px",
              alignContent: "center",
              background: "#007bff",
              color: "white",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "0.3s",
              borderRadius: 10,
              fontWeight: "bold",
            }}
          >
            Asociar Evento
          </button>
        </div>

        {mensaje && (
          <p style={{ marginTop: 10, fontWeight: "bold" }}>{mensaje}</p>
        )}
      </div>

      {/* TABLA ASOCIACIONES */}
      <table
        width="100%"
        style={{
          background: "#fff",
          borderCollapse: "collapse",
          marginTop: 20,
          boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
        }}
      >
        <thead style={{ background: "#2563EB", color: "#fff" }}>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Evento</th>
            <th>Fecha Asociación</th>
          </tr>
        </thead>
        <tbody>
          {usuariosEventos?.map(ue => (
            <tr key={ue.id}>
              <td>{ue.id}</td>
              <td>{obtenerNombreUsuario(parseInt(ue.usuario_id))}</td>
              <td>{obtenerNombreEvento(parseInt(ue.evento_id))}</td>
              <td>{new Date(String(ue.fecha_creacion)).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
