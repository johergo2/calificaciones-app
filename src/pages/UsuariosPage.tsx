import { useEffect, useState } from "react";
import { getUsuarios, 
         obtenerUsuarioPorNombre,
         crearUsuario,
         actualizarUsuario,
         eliminarUsuario } from "../services/api";
import type {Usuario} from "../services/api";
import { useNavigate } from "react-router-dom";


export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editando, setEditando] = useState<Usuario | null>(null);

  const [formData, setFormData] = useState<Usuario>({
    nombre: "",
    email: "",
    contrasena: "",
    estado: "",
    rol: "",
  });

  const [errorNombre, setErrorNombre] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorContrasena, setErrorContrasena] = useState<string>("");
  const [errorEstado, setErrorEstado] = useState<string>("");
  const [errorRol, setErrorRol] = useState<string>("");

  //const [mensajeOk, setMensajeOk] = useState<string>("")
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [popupMensaje, setPopupMensaje] = useState("");

  // Usuario que inicia sesión viene de LoginPage.tsx
  const usuarioNombre = localStorage.getItem("usuarioNombre") ?? "Usuario";
  console.log("usuarioNombre:", usuarioNombre);  

  const navigate = useNavigate();


  const cargarUsuarios = async () => {
    if (usuarioNombre === "Administrador") {
      const data = await getUsuarios();
      setUsuarios(data);
    } else {
      const usuario = await obtenerUsuarioPorNombre(usuarioNombre);
      setUsuarios(usuario ? [usuario] : []);
    }        
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);



  const guardarUsuario = async () => {
    // VALIDACIÓN: Campos obligatorios
    if (!formData.nombre || formData.nombre.trim() === "") {
      setErrorNombre("Debe ingresar un nombre - Obligatorio");
      return; // detener el guardado  
    }  
    if (!formData.email || formData.email.trim() === "") {
      setErrorEmail("Debe ingresar el email del usuario - Obligatorio");
      return; // detener el guardado  
    }  
    if (!formData.contrasena || formData.contrasena.trim() === "") {
      setErrorContrasena("Debe ingresar una contraseña para el usuario - Obligatorio");
      return; // detener el guardado  
    }  
      if (!formData.estado || formData.estado.trim() === "") {
      setErrorEstado("Debe ingresar el estado ACT o INA del usuario - Obligatorio");
      return; // detener el guardado  
    }  
    if (!formData.rol || formData.rol.trim() === "") {
      setErrorRol("Debe asociar el Rol al usuario - Obligatorio");
      return; // detener el guardado  
    }    
    setErrorNombre(""); // limpiar error si hay nombre
    setErrorEmail(""); // limpiar error si hay email
    setErrorContrasena(""); // limpiar error si hay contraseña
    setErrorEstado(""); // limpiar error si hay Estado
    setErrorRol(""); // limpiar error si hay rol

    const payload = {
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      contrasena: formData.contrasena.trim(),
      estado: formData.estado.trim(),
      rol: formData.rol.trim(),      
    };

    try {
      if (editando) {
        await actualizarUsuario(editando.id!, payload);
        //setMensajeOk("✔️ Participante actualizado correctamente");
        setPopupMensaje("✔️ Usuario actualizado correctamente");
        setMostrarPopup(true);
        setEditando(null);
      } else {
        await crearUsuario(payload);
        //setMensajeOk("✔️ Participante creado correctamente");
        setPopupMensaje("✔️ Usuario creado correctamente");
        setMostrarPopup(true);
      }
      // Resetear formulario
      setFormData({
        nombre: "",
        email: "",            
        contrasena: "",      
        estado: "",      
        rol: "",      
      });

      cargarUsuarios();

      // Ocultar el mensaje después de 4 segundos
      //setTimeout(() => setMensajeOk(""), 4000);

    } catch (error) {
    console.error("Error al guardar usuario: ", error);
    setErrorNombre("Error al guardar usuario, revisa el nombre.");
    setErrorEmail("Error al guardar usuario, revisa el email.");
    setErrorContrasena("Error al guardar usuario, revisa la contrasena.");
    setErrorEstado("Error al guardar usuario, revisa el estado.");
    setErrorRol("Error al guardar usuario, revisa el Rol.");
    }

  };

  const editar = (evento: Usuario) => {
    setEditando(evento);
    setFormData({
      ...evento,
      nombre: evento.nombre || "",
    });
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      await eliminarUsuario(id);
      cargarUsuarios();
    }
  };

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


  //Estilos para popup
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: "25px 40px",
  borderRadius: 10,
  textAlign: "center",
  minWidth: 300,
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};

const botonCerrarStyle: React.CSSProperties = {
  marginTop: 15,
  padding: "8px 20px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};   

// Estilos para tabla inferior
  const thStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: "0.85rem",
  fontWeight: 600,
  textTransform: "uppercase",
  borderBottom: "2px solid #1005a7ff",
  borderRight: "1px solid #E5E7EB",
};

  return (
    <div style={{ width: "90vw", padding: 20, background: "#f1f5f9", 
                  minHeight: "100vh", position: "relative" }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF", 
                  fontWeight: 700, letterSpacing: "0.5PX" 
                  }}>⚖️ CREAR USUARIO
      </h2>

      {/* Botón regresar al menú */}

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
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", 
                    marginBottom: "10px" }}>
        <button
          onClick={() => navigate("/MenuUsuarios")}
          style={{
            padding: "8px 32px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.75rem",
            alignItems: "rigth",
          }}
        >
          ⬅ Regresar
        </button>
      </div>

      {mostrarPopup && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <p>{popupMensaje}</p>
            <button
              onClick={() => setMostrarPopup(false)}
              style={botonCerrarStyle}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          border: "1px solid #076df3ff",
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
        }}
      >
        <h3 style={{ marginBottom: "10px", textAlign: "center", color: "#444", fontSize: "1.2rem" }}>
          {editando ? "✏️ Editar Usuario" : "📝 Crear Usuario"}
        </h3>

        {/* Campo - Nombre */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Nombre del Usuario:
          </label>
          <input
            name="nombre"
            placeholder="Nombre del usuario"
            value={formData.nombre}
            onChange={(e) => {
              setFormData({...formData, nombre: e.target.value});
              setErrorNombre(""); // Limpiar el error si el usuario ingresa la cedula
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          {errorNombre && (
            <p style={{color: "red", marginTop: 5}}>
              {errorNombre}
            </p>
          )}          
        </div>

        {/* Campo - Email */}
        <div style={{ marginBottom: "1px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Email del Usuario:
          </label>
          <input
            name="email"
            placeholder="email del usuario"
            value={formData.email}
            onChange={(e) => {
              setFormData({...formData, email: e.target.value});
              setErrorEmail(""); // Limpiar el error si el usuario ingresa el nombre
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #bbb",
              height: 20,              
              fontSize: "1rem",
            }}
          />
          {errorEmail && (
            <p style={{color: "red", marginTop: 5}}>
              {errorEmail}
            </p>
          )}
        </div>

        {/* Campo - Contraseña */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Contraseña:
          </label>
          <input
            name="contrasena"
            value={formData.contrasena}
            onChange={ (e) => {
              setFormData({...formData, contrasena: e.target.value});
              setErrorContrasena(""); //Limpiar el error si el usuario ingresa la contrasena
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #bbb",
              fontSize: "1rem",
            }}
          />
          {errorContrasena && (
            <p style={{color: "red", marginTop: 5}}>
              {errorContrasena}
            </p>
          )}          
        </div>

        {/* Campo - Estado */}
        <div style={{ marginBottom: "1px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Estado del Usuario:
          </label>
          <select
            name="estado"            
            value={formData.estado}
            onChange={(e) => {
              setFormData({...formData, estado: e.target.value});
              setErrorEstado(""); // Limpiar el error si el usuario ingresa el estado
            }}
            style={{
              width: "20%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #bbb",
              height: 30,              
              fontSize: "1rem",
            }}
          >
            <option value="">-- Seleccione estado --</option>
            <option value="ACT">ACT</option>
            <option value="INA">INA</option>            
          </select>
          {errorEstado && (
            <p style={{color: "red", marginTop: 5}}>
              {errorEstado}
            </p>
          )}
        </div>  

        {/* Campo - Rol */}
        <div style={{ marginBottom: "1px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
            Rol del Usuario:
          </label>
          <select
            name="rol"            
            value={formData.rol}
            onChange={(e) => {
              setFormData({...formData, rol: e.target.value});
              setErrorRol(""); // Limpiar el error si el usuario ingresa el rol
            }}
            style={{
              width: "20%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #bbb",
              height: 35,              
              fontSize: "1rem",
            }}
          >
            <option value="">-- Seleccione Rol --</option>
            <option value="Participante">Participante</option>
            <option value="Jurado">Jurado</option>             
            <option value="Administrador">Administrador</option>             
          </select>
          {errorRol && (
            <p style={{color: "red", marginTop: 5}}>
              {errorRol}
            </p>
          )}
        </div>              

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <button
            onClick={guardarUsuario}
            style={{
              padding: "10px",
              width: "20%",
              alignContent: "center",
              background: editando ? "#28a745" : "#007bff",
              color: "white",
              border: "none",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: 10,
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {editando ? "Actualizar2" : "Crear Usuario"}
          </button>
        </div>
      </div>


      {/* Tabla de eventos */}
      <table
        width="100%" 
        style={{
            marginTop: 20,            
            borderCollapse: "collapse",
            background: "#FFFFFF",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            tableLayout: "fixed",
            textOverflow: "ellipsis", 
            fontSize: "0.8rem",
        }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr style={{ background: "linear-gradient(90deg, #007bff, #2563EB)", color: "#FFFFFF", textAlign: "left"}}>
            <th style={{ ...thStyle, width: "5%"}}>ID</th>
            <th style={{ ...thStyle, width: "20%"}}>Nombre</th>
            <th style={{ ...thStyle, width: "20%"}}>Email</th>            
            <th style={{ ...thStyle, width: "10%"}}>Contrasena</th>
            <th style={{ ...thStyle, width: "5%"}}>Estado</th>
            <th style={{ ...thStyle, width: "10%"}}>Rol</th>
            <th style={{ ...thStyle, width: "18%"}}>Fecha Actualización</th>
            <th style={{ ...thStyle, width: "12%"}}>Eventos</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((e) => (
            <tr key={e.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.id}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.nombre}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.email}</td>              
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{"*".repeat(Math.min(e.contrasena?.length || 8, 8))}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.estado}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.rol}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{formatearFechaHora(e.fecha_actualizacion)}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>
                <button 
                  style={{ 
                    marginLeft: 10, 
                    padding: "4px 15px",
                    background: "#bbc2caff", 
                    border: "1px solid #59636eff",
                    boxShadow: "0 2px 4px #4f555cff, 0 6px 10px rgba(0,0,0,0.2)",
                    color: "red" 
                  }}                
                  onClick={() => editar(e)}>
                    📝
                </button>
                <button
                  onClick={() => eliminar(e.id!)}                  
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
