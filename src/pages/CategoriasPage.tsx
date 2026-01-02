import { useEffect, useState } from "react";
import type { Categorias } from "../services/categoriasApi";

import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/categoriasApi";

import type { CategoriaForm } from "../services/categoriasApi";
import { useNavigate } from "react-router-dom";


export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [editando, setEditando] = useState<Categorias | null>(null);

  const [formData, setFormData] = useState<CategoriaForm>({
    categoria: "",    
  });

  const [errorCategoria, setErrorCategoria] = useState<string>("");

  //const [mensajeOk, setMensajeOk] = useState<string>("")
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [popupMensaje, setPopupMensaje] = useState("");

  const navigate = useNavigate();


  const cargarCategorias = async () => {
    const data = await getCategorias();
    setCategorias(data);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

 /* const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };*/

  const guardarCategoria = async () => {
  // VALIDACIÓN: Campos obligatorios
  if (!formData.categoria || formData.categoria.trim() === "") {
    setErrorCategoria("Debe ingresar una categoria - Obligatorio");
    return; // detener el guardado  
  }  
  
    setErrorCategoria(""); // limpiar error si hay cedula

    const payload = {
      //id: formData.id,
      categoria: formData.categoria.trim(),      
    };

    try {
      if (editando) {
        await actualizarCategoria(editando.id!, payload);
        //setMensajeOk("✔️ Categoria actualizada correctamente");
        setPopupMensaje("✔️ Evento actualizado correctamente");
        setMostrarPopup(true); 
        setEditando(null);
      } else {
        await crearCategoria(payload);
        //setMensajeOk("✔️ Categoria creada correctamente");
        setPopupMensaje("✔️ Evento actualizado correctamente");
        setMostrarPopup(true); 
      }
    
    

      // Resetear formulario
      setFormData({
        categoria: "",   
      });

      cargarCategorias();

      // Ocultar el mensaje después de 4 segundos
      //setTimeout(() => setMensajeOk(""), 4000);

   } catch (error) {
     console.error("Error al guardar evento: ", error);
     setErrorCategoria("Error al guardar categoria1, revisa los datos.");    
   }

  };

  const editar = (evento: Categorias) => {
    setEditando(evento);
    setFormData({
      ...evento,
      categoria: evento.categoria || "",
    });
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta categoria?")) {
      await eliminarCategoria(id);
      cargarCategorias();
    }
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
    <div style={{ width: "90vw", padding: 20, background: "#f1f5f9", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#1E40AF", 
                   fontWeight: 700, letterSpacing: "0.5PX" 
                  }}>🏷️ GESTIONAR CATEGORÍAS</h2>

      {/* Botón regresar al menú */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button
          onClick={() => navigate("/DatosBasicos")}
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
          {editando ? "✏️ Editar Categoría" : "📝 Crear Categoría"}
        </h3>

        {/* Campo - categoría */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>Categoría (evento):</label>
          <input
            name="categoria"
            placeholder="categoría del evento"
            value={formData.categoria}
            onChange={(e) => {
              setFormData({...formData, categoria: e.target.value});
              setErrorCategoria(""); // Limpiar el error si el usuario ingresa la categoria
            }}
            style={{
              width: "98%",
              padding: "6px",
              borderRadius: 10,
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          {errorCategoria && (
            <p style={{color: "red", marginTop: 5}}>
              {errorCategoria}
            </p>
          )}          
        </div>

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <button
            onClick={guardarCategoria}
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
            {editando ? "Actualizar" : "Crear Categoría"}
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
        }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr style={{ background: "linear-gradient(90deg, #007bff, #2563EB)", color: "#FFFFFF", textAlign: "left"}}>
            <th style={{ ...thStyle, width: "10%"}}>ID</th>
            <th style={{ ...thStyle, width: "75%"}}>Categoria</th>
            <th style={{ ...thStyle, width: "15%"}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((e) => (
            <tr key={e.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.id}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8 }}>{e.categoria}</td>
              <td style={{ border: "1px solid #141313ff", padding: 8, textAlign: "center" }}>
                <button onClick={() => editar(e)}
                  style={{ 
                    marginLeft: 10, 
                    padding: "4px 15px",
                    background: "#bbc2caff", 
                    border: "1px solid #59636eff",
                    boxShadow: "0 2px 4px #4f555cff, 0 6px 10px rgba(0,0,0,0.2)",
                    color: "blue" }}                
                >📝</button>
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
