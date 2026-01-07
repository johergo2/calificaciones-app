import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import {
  getUsuarios,
  getUsuariosEventos,
  crearUsuarioEvento,
  actualizarUsuarioEvento,
  eliminarUsuarioEvento,
} from "../services/api";

import {
  getEventos
} from "../services/eventosApi";

import type { Usuario, UsuarioEvento } from "../services/api";

import type { Evento } from "../services/eventosApi";

type FormUsuarioEvento = {
  usuario_id: number | null;
  evento_id: number | null;
};


export default function UsuariosEventosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [usuariosEventos, setUsuariosEventos] = useState<UsuarioEvento[]>([]);
  const navigate = useNavigate();

  //const [usuarioIdSeleccionado, setUsuarioId] = useState<number | null>(null);
  //const [eventoId, setEventoId] = useState<number | "">("");

  const [mensaje, setMensaje] = useState<string>("");

  const [editando, setEditando] = useState<UsuarioEvento | null>(null);

  const [formData, setFormData] = useState<FormUsuarioEvento>({
    usuario_id: null,
    evento_id: null,
  });

  const cargarUsuarios = async () => {
    const data = await getUsuariosEventos();
    setUsuariosEventos(data);
  };

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
    if (!formData.usuario_id || !formData.evento_id) {
      setMensaje("Debe seleccionar un usuario y un evento");
      return;
    }

    //const payload = {
    //  usuario_id: formData.usuario_id,
    //  evento_id: formData.evento_id,      
    //};

    try {
      if (editando) {
        await actualizarUsuarioEvento(editando.id!, {         
          evento_id: formData.evento_id as number,
        });
        setMensaje("✔️ Asociación actualizada correctamente");
      } else {
        await crearUsuarioEvento(formData);
        setMensaje("✔️ Evento asociado correctamente");      
      }
      setEditando(null);
      setFormData({ usuario_id: null, evento_id: null });
      cargarDatos();

    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al asociar evento");
    }
  };

  const editar = (ue: UsuarioEvento) => {
    setEditando(ue);
    setFormData({
      usuario_id: ue.usuario_id,
      evento_id: ue.evento_id,
    });
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      await eliminarUsuarioEvento(id);
      cargarUsuarios();
    }
  };

  const obtenerNombreUsuario = (id: number) =>
    usuarios.find(u => u.id === id)?.nombre || "—";

  const obtenerNombreEvento = (id: number) =>
    eventos.find(e => e.id === id)?.nombre || "—";

  //==============================================
  // Función para dar formato a datos tipo fecha
  //==============================================
  const formatearFechaHora = (fecha?: string | null) => {
  if (!fecha) return "";

  const d = new Date(fecha);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
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

  console.log("usuariosEventos pantalla:", usuariosEventos);


  /* ===============================
     Formulario
  ================================ */
  return (
    <div style={{ width: "100vw", padding: 20, background: "#f1f5f9", 
                  minHeight: "100vh",  border: "3px solid green", boxSizing: "border-box",
                   }}
    >
      <h2 style={{ textAlign: "center", color: "#1E40AF" }}>
        🔗 Asociación Usuarios - Eventos
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
        <button onClick={() => navigate("/MenuUsuarios")}
                  style={{
                    background: "#007bff",
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "6px 32px",
                    marginBottom: "12px",
                    //height: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                    transition: "all 0.2s",
                  }}                    
        >          
          ⬅ Regresar</button>
      </div>

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
            value={formData.usuario_id ?? ""}
            onChange={(e) => setFormData({
                               ...formData,
                               usuario_id: Number(e.target.value)
                              })
            }
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
                {u.nombre} 
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>Evento:</label>
          <select
            value={formData.evento_id ?? ""}
            onChange={(e) => setFormData({
                              ...formData,
                              evento_id: Number(e.target.value),
                             })
            }
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
                {e.nombre} 
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
              background: editando ? "#28a745" : "#007bff",
              color: "white",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "0.3s",
              borderRadius: 10,
              fontWeight: "bold",
            }}
          >
            {editando ? "Actualizar Evento" : "Asociar Evento"}
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
          background: "#FFFFFF",
          borderCollapse: "collapse",
          borderRadius: 12,
          overflow: "hidden",
          marginTop: 20,          
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <thead>
          <tr style={{background: "linear-gradient(90deg, #007bff, #2563EB)",
                      color: "#FFFFFF", textAlign:"center"
          }}>
            <th style={{ ...thStyle, width: "5%"}}>ID</th>
            <th style={{ ...thStyle, width: "25%"}}>Usuario</th>
            <th style={{ ...thStyle, width: "40%"}}>Evento</th>
            <th style={{ ...thStyle, width: "15%"}}>Fecha Asociación</th>
            <th style={{ ...thStyle, width: "15%"}}>Eventos</th>
          </tr>
        </thead>
        <tbody>
          {(usuariosEventos ?? []).length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                  No hay eventos asociados a usuarios
              </td>
            </tr>
          ) : (
            usuariosEventos.map((ue, index) => (
            <tr key={index}>
              <td style={tdStyle}>{ue.id}</td>              
              <td style={tdStyle}>{obtenerNombreUsuario(Number(ue.usuario_id))}</td>
              <td style={tdStyle}>{obtenerNombreEvento(Number(ue.evento_id))}</td>
              <td style={{ ...tdStyle, textAlign: "center"}}>{formatearFechaHora(ue.fecha_creacion)}</td>
              <td style={tdStyle}>
                <button
                  style={{ 
                    marginLeft: 10, 
                    padding: "4px 15px",
                    background: "#bbc2caff", 
                    border: "1px solid #59636eff",
                    boxShadow: "0 2px 4px #4f555cff, 0 6px 10px rgba(0,0,0,0.2)",
                    color: "red" 
                  }}                                 
                  onClick={() => editar(ue)}
                >
                    📝                 
                </button>
                <button
                  onClick={() => eliminar(ue.id!)}                  
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
            ))          
          )}          
        </tbody>
      </table>
    </div>
  );
}
