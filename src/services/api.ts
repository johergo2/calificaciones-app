import axios from "axios";

const API_URL = "https://api-usuarios-f1im.onrender.com/api";

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  contrasena: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  estado: string;
  rol: string;
}

export interface UsuarioEvento {
  id?: number;
  usuario_id: string;
  evento_id: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

//======================================
// Obtener todos los usuarios
//======================================
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await axios.get(`${API_URL}/usuarios`);
  return response.data.usuarios;
};

//======================================
// Obtener usuario por nombre
//======================================
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

//======================================
// Validar login
//======================================
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

//======================================
//Crear Usuario
//======================================
export const crearUsuario = async (evento: Usuario) => {
  const response = await axios.post(`${API_URL}/usuario`, evento);
  return response.data;
};

//======================================
// Actualizar Usuario
//======================================
export const actualizarUsuario = async (id: number, evento: Usuario) => {
  const response = await axios.put(`${API_URL}/usuarios/${id}`, evento);
  return response.data;
};

//======================================
// Eliminar usuario
//======================================
export const eliminarUsuario = async (id: number) => {
  const response = await axios.delete(`${API_URL}/usuarios/${id}`);
  return response.data;
};

//====================================================
// Obtener todos los usuarios y sus eventos asociados
//====================================================
export const getUsuariosEventos = async (): Promise<UsuarioEvento[]> => {
  const response = await axios.get(`${API_URL}/usuarios-eventos`);
  return response.data.usuarioseventos;
};

//======================================
// Crear Usuarios Eventos
//======================================
export const crearUsuarioEvento = async (evento: UsuarioEvento) => {
  const response = await axios.post(`${API_URL}/usuario-evento`, evento);
  return response.data;
};


//======================================
// Actualizar Usuarios Eventos
//======================================
export const actualizarUsuarioEvento = async (id: number, evento: UsuarioEvento) => {
  const response = await axios.put(`${API_URL}/usuarios-eventos/${id}`, evento);
  return response.data;
};

//======================================
// Eliminar usuarios eventos
//======================================
export const eliminarUsuarioEvento = async (id: number) => {
  const response = await axios.delete(`${API_URL}/usuarios-eventos/${id}`);
  return response.data;
};
