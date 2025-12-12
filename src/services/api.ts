import axios from "axios";

const API_URL = "https://api-usuarios-f1im.onrender.com/api";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contrasena: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

// Obtener usuario por nombre
export const obtenerUsuarioPorNombre = async (
  nombre: string
): Promise<Usuario | null> => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/nombre/${encodeURIComponent(nombre)}`);
    console.log("📌 API respondió:", response.data); // 👈 Mostrar lo que llega de la API
    console.log("Nombre enviado:", nombre);
    const url = `${API_URL}/usuarios/nombre/${encodeURIComponent(nombre)}`;
    console.log("URL generada:", url);
    return response.data; // La API retorna 1 usuario
   } catch (error: any) {
    console.log("=== ERROR EN API ===");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return null;
  }
};

// Validar login
export const validarUsuario = async (
  nombre: string,
  contrasena: string
): Promise<Usuario | null> => {
  try {
    const usuario = await obtenerUsuarioPorNombre(nombre);
    console.log("API respondió (validarUsuario):", usuario);
    if (usuario && usuario.contrasena === contrasena) {
      return usuario;
    }

    return null;
  } catch (error) {
    console.error("Error al consultar la API:", error);
    return null;
  }
};
