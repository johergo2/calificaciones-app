import { useState } from "react";
import { obtenerUsuarioPorNombre } from "../services/api";
import { useNavigate } from "react-router-dom";
import FondoPpal from "../imagenes/Fondo1.jpeg"


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
      //Guarda el ID y Nombre de usuario conectado
      localStorage.setItem("usuarioId", String(usuario.id));
      localStorage.setItem("usuarioNombre", usuario.nombre);
      localStorage.setItem("usuarioRol", usuario.estado);
      localStorage.setItem("usuarioRol", usuario.rol);

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
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

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
            width: "90%",
            maxWidth: "420px",
            padding: "30px 25px",
            //background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            borderRadius: "16px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
            alignItems: "center",
            backdropFilter: "blur(6px)",
            background: "linear-gradient(135deg,rgba(241, 245, 249, 0.96), rgba(203, 213, 225, 0.92))",
          }}
        >

        <h2
          style={{
            marginBottom: "1px",
            color: "#0f4aebff",
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}        
        >CalificaPro</h2>

        <h3
          style={{
            marginBottom: "8px",
            marginTop: "6px",
            color: "#083bc9ff",
            fontWeight: 400,
            letterSpacing: "0.2px",
            fontSize: 12,
            textAlign: "center",
            lineHeight: "1.5",
          }} 
        > Aplicación para evaluación de eventos, permite crear jurados, calificar participantes y generar resultados para determinar ganadores.                          
        </h3>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ width: "60%", marginBottom: 10, 
            padding: 8, borderRadius: 6, borderColor: "#d5d9dfff" }}
        />

        <input
          placeholder="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          style={{ width: "60%", marginBottom: 10, padding: 8, borderRadius: 6, borderColor: "#d5d9dfff" }}
        />

        <button onClick={handleLogin} 
          style={{ width: "60%", 
                   padding: 8, 
                   background: "#007bff", 
                   alignItems: "center", color: "white" 
                 }} 
                 disabled={loading} >
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
