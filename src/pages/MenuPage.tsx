import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Centra verticalmente
        alignItems: "center",     // Centra horizontalmente
        height: "100vh",          // Ocupa toda la pantalla
        width: "100vw",           // Garantiza ancho completo             
        background: "#f5f5f5",
      }}
    >
      <div
      style={{
        width: "100%",
        maxWidth: 1020,
        background: "#ebeef0ff",
        borderRadius: 12,
        padding: 28,
        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
        borderColor: "#8cbbf8ff",
        borderWidth: "1px",
        borderStyle: "solid",
        textAlign: "center",
      }}
      >

        {/* TÍTULO PRINCIPAL */}
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          Sistema Calificación Concursantes
        </h1>

        <h2 style={{ marginBottom: 30 }}>🏆 Menú Principal</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

         {/*BOTONES DEL MENU*/}
         <button
           onClick={() => navigate("/eventos")}
           style={botonEstilo}
         >
           Crear Eventos
         </button>

         <button
           onClick={() => navigate("/categorias")}
           style={botonEstilo}
         >
           Crear Categorías
         </button>

         <button
           onClick={() => navigate("/asignarcategorias")}
           style={botonEstilo}
         >
           Asociar Categorias/Eventos
         </button>

         <button
           onClick={() => navigate("/participantes")}
           style={botonEstilo}
         >
           Crear Participantes
         </button>

         <button
           onClick={() => navigate("/asignarParticipantes")}
           style={botonEstilo}
         >
           Asociar Participantes/Eventos/Categorias
         </button>

         <button
           onClick={() => navigate("/jurados")}
           style={botonEstilo}
         >
           Crear Integrantes de Jurado
         </button>

         <button
           onClick={() => navigate("/asignarJurados")}
           style={botonEstilo}
         >
           Asociar Jurados/Eventos/Categorias
         </button>

         <button
           onClick={() => navigate("/calificaciones")}
           style={botonEstilo}
         >
           Calificar Participante
         </button>
        </div>
      </div>
    </div>
  );
}

const botonEstilo: React.CSSProperties = {
  width: "50%",
  padding: "14px",
  fontSize: "1.1rem",
  marginBottom: "15px",
  borderRadius: 10,
  background: "#007bff",
  color: "white",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  display: "block",   // 👈 necesario para que margin auto funcione
  margin: "0 auto",   // 👈 CENTRA HORIZONTALMENTE
};
