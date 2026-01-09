import { useNavigate } from "react-router-dom";
import FondoPpal from "../imagenes/Fondo2.jpg"

export default function MenuPage() {
  const navigate = useNavigate();

// Usuario que inicia sesión viene de LoginPage.tsx
const usuarioNombre = localStorage.getItem("usuarioNombre") ?? "Usuario";
const usuarioRol = localStorage.getItem("usuarioRol"); 
console.log("usuarioNombre:", usuarioNombre);    
console.log("usuarioRol:", usuarioRol);  

const cerrarSesion = () => {
  // Elimina datos de autenticación
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  // Redirige al login
  navigate("/", { replace: true });
};


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
        backgroundImage: `
          linear-gradient(
            rgba(2,6,23,0.25),
            rgba(2,6,23,0.25)
          ),
          url(${FondoPpal})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",        
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
        position: "relative",
        backgroundColor: "rgba(235, 238, 240, 0.8)"
      }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 15,
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
            onClick={cerrarSesion}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "#007bff",
              color: "white",
              padding: "6px 22px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.8rem",
              zIndex: 10,
            }}
          >
            Cerrar sesión
          </button>
        </div>


        {/* TÍTULO PRINCIPAL */}
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          Sistema Calificación Concursantes
        </h1>

        <h2 style={{ marginBottom: 30 }}>🏆 Menú Principal</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

         {/*BOTONES DEL MENU*/}
        {(usuarioRol === "Administrador") && (         
          <button
            onClick={() => navigate("/MenuUsuarios")}
            style={botonEstilo}
          >
            Gestión de Usuarios
          </button>  
        )} 

        {(usuarioRol === "Administrador" || usuarioRol === "Jurado") && (         
          <button
            onClick={() => navigate("/DatosBasicos")}
            style={botonEstilo}
          >
            Datos Básicos
          </button>  
        )} 

        {(usuarioRol === "Administrador" || usuarioRol === "Jurado") && (
          <button
            onClick={() => navigate("/EstructuraEventos")}
            style={botonEstilo}
          >
            Estructurar Evento
          </button>  
        )} 

        {(usuarioRol === "Participante" || usuarioRol === "Administrador" || usuarioRol === "Jurado") && (
          <button
            onClick={() => navigate("/MenuCalificacionesPage")}
            style={botonEstilo}
          >
            Calificaciones
          </button>
        )}

                
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
