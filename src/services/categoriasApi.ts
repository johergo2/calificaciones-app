import axios from "axios";

const API_URL = "https://api-usuarios-f1im.onrender.com/api"; // cambia si estás local

// Categoría que viene de BD
export interface Categorias {
  id: number;
  categoria: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Datos para crear / editar (SIN id)
export interface CategoriaForm {
  categoria: string;
}

// Obtener todas las categorias
export const getCategorias = async (): Promise<Categorias[]> => {
  const response = await axios.get(`${API_URL}/categorias`);
  return response.data.categorias;
};

// Crear categoria
export const crearCategoria = async (evento: CategoriaForm) => {
  const response = await axios.post(`${API_URL}/categorias`, evento);
  return response.data;
};

// Actualizar categoria
export const actualizarCategoria = async (id: number, evento: CategoriaForm) => {
  const response = await axios.put(`${API_URL}/categoria/${id}`, evento);
  return response.data;
};

// Eliminar categoria
export const eliminarCategoria = async (id: number) => {
  const response = await axios.delete(`${API_URL}/categoria/${id}`);
  return response.data;
};
