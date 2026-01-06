import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const navigate = useNavigate();

// Usuario que inicia sesión viene de LoginPage.tsx
const usuarioNombre = localStorage.getItem("usuarioNombre") ?? "Usuario";
console.log("usuarioNombre:", usuarioNombre);   


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
          display: "grid",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 145,
            left: 155,
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
          <button
            onClick={() => navigate("/menu")}
            style={{
              position: "absolute",
              top: 180,
              right: 170,
              background: "#007bff",
              color: "white",
              padding: "6px 32px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.8rem",
              //zIndex: 10,
            }}
          >
            ⬅ Regresar
          </button>
        </div>


        {/* TÍTULO PRINCIPAL */}
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginTop: "10px",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          🛠️ Estructurar Evento
        </h1>

        <h2 style={{ marginBottom: 30 }}>Asignar categorias, participantes y jurados</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

         {/*BOTONES DEL MENU*/}
         <button
           onClick={() => navigate("/asignarcategorias")}
           style={botonEstilo}
         >
          Asociar Categorias/Eventos
         </button>

         <button
           onClick={() => navigate("/asignarJurados")}
           style={botonEstilo}
         >
           Asociar Jurados/Eventos/Categorias
         </button>         

         <button
           onClick={() => navigate("/asignarParticipantes")}
           style={botonEstilo}
         >
           Asociar Participantes/Eventos/Categorias
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
