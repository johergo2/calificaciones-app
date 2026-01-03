import { useState } from "react";
import { obtenerUsuarioPorNombre } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  //const [debugData, setDebugData] = useState<any>(null); // 👈 NUEVO

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ⬅️ NUEVO

  const handleLogin = async () => {
    setError("");
    setMensaje("");
    //setDebugData(null);
    setLoading(true); // ⬅️ Mostrar reloj de carga

    const usuario = await obtenerUsuarioPorNombre(nombre);

    // 👇 Mostrar en pantalla lo que trae la API
    //setDebugData(usuario);

    if (!usuario) {
      setLoading(false);
      setError("Usuario no encontrado o inactivo LoginPage.tsx");
      return;
    }

    if (usuario.contrasena === contrasena) {
      localStorage.setItem("usuarioId", String(usuario.id)); //Captura usuario
      setMensaje(`Bienvenido ${usuario.nombre}`);

      // Esperar 3 segundos antes de pasar al menú (opcional)
      setTimeout(() => {
        navigate("/menu"); // 👈 redirige a la página de eventos
      }, 3000);          
    
    } else {
      setLoading(false);
      setError("Contraseña incorrecta LoginPage.tsx");
    }
  };

  return (
    <div 
      style={{ 
        minHeight: "100vh",          // Ocupa toda la pantalla
        width: "100vw",           // Garantiza ancho completo        
        display: "flex",
        justifyContent: "center", // Centra verticalmente        
        flexDirection: "column",
        alignItems: "center",     // Centra horizontalmente        
       // margin: "50px auto", 
        textAlign: "center",
       // background: "#f5f5f5",
      }}
    >

        <div
          style={{
            width: "80vw",
            maxWidth: "600px",       
            padding: "20px"      ,
            background: "#ebeef0ff",
            display: "flex",
            flexDirection: "column",
            gap: "15px",          
            borderRadius: "12px", 
            borderColor: "#8cbbf8ff",
            borderWidth: "1px",
            borderStyle: "solid",
            alignItems: "center",     // Centra horizontalmente     
          }}
        >

        <h2>Inicio Calificaciones</h2>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ width: "60%", marginBottom: 10, padding: 8, borderRadius: 6, borderColor: "#d5d9dfff" }}
        />

        <input
          placeholder="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          style={{ width: "60%", marginBottom: 10, padding: 8, borderRadius: 6, borderColor: "#d5d9dfff" }}
        />

        <button onClick={handleLogin} style={{ width: "60%", padding: 8, background: "#007bff", alignItems: "center", color: "white" }} disabled={loading} >
          Ingresar
        </button>

        {loading && (
         <div style={{ textAlign: "center", marginTop: 15 }}>
            <div className="spinner"></div>
            <p>Cargando...</p>
          </div>
        )}

        {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}


        </div>
    </div>
  );
}
