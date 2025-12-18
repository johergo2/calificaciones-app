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
  const [mensajeOk, setMensajeOk] = useState<string>("")

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
        setMensajeOk("✔️ Categoria actualizada correctamente");
        setEditando(null);
      } else {
        await crearCategoria(payload);
        setMensajeOk("✔️ Categoria creada correctamente");
      }
    
    

      // Resetear formulario
      setFormData({
        categoria: "",   
      });

      cargarCategorias();

      // Ocultar el mensaje después de 4 segundos
      setTimeout(() => setMensajeOk(""), 4000);

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

  return (
    <div style={{ width: "90vw", margin: 0, padding: "10px", boxSizing: "border-box" }}>
      <h2 style={{ textAlign: "center", marginBottom: 2 }}>GESTIONAR CATEGORÍAS</h2>

      {/* Botón regresar al menú */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button
          onClick={() => navigate("/menu")}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.6rem",
            alignItems: "rigth",
          }}
        >
          ⬅ Volver al Menú
        </button>
      </div>



      {/* Formulario */}
      <div
        style={{
          padding: "15px",
          borderRadius: "14px",
          background: "#f0f0f0",
          //boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#add8e6",
          marginBottom: "5px",
          width: "100%",
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

        {/* Contenedor de Fecha y Tipo, alineados horizontalmente */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",              // espacio entre los campos                     
            marginBottom: "10px",
            alignItems: "flex-start", // alinear la parte superior
          }}
        >
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

      {mensajeOk && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "10px",
            textAlign: "center",
            border: "1px solid #c3e6cb",
            fontWeight: "bold",
          }}
        >
          {mensajeOk}
        </div>
      )}

      {/* Tabla de eventos */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 20,
          background: "white",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #141313ff", // borde externo
        }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th style={{ border: "1px solid #141313ff", padding: 8 }}>ID</th>
            <th style={{ border: "1px solid #141313ff", padding: 8 }}>Categoria</th>
            <th style={{ border: "1px solid #141313ff", padding: 8 }}>Acciones</th>
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
                >Editar</button>
                <button
                  onClick={() => eliminar(e.id!)}
                  style={{ 
                    marginLeft: 10, 
                    padding: "4px 15px",
                    background: "#bbc2caff", 
                    border: "1px solid #59636eff",
                    boxShadow: "0 2px 4px #4f555cff, 0 6px 10px rgba(0,0,0,0.2)",
                    color: "red" }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
