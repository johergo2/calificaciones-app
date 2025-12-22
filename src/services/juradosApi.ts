import axios from "axios";

//const API_URL = "http://localhost:8000/api"; // cambia si estás local
const API_URL = "https://api-usuarios-f1im.onrender.com/api"; // cambia si estás en Render.com

export interface Jurado {
  id?: number;
  cedula: string;
  nombre: string;  
  observacion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Obtener todos los jurados
export const getJurados = async (): Promise<Jurado[]> => {
  const response = await axios.get(`${API_URL}/jurados`);
  return response.data.jurados;
};

// Crear jurado
export const crearJurado = async (evento: Jurado) => {
  const response = await axios.post(`${API_URL}/jurados`, evento);
  return response.data;
};

// Actualizar jurado
export const actualizarJurado = async (id: number, evento: Jurado) => {
  const response = await axios.put(`${API_URL}/jurados/${id}`, evento);
  return response.data;
};

// Eliminar jurado
export const eliminarJurado = async (id: number) => {
  const response = await axios.delete(`${API_URL}/jurados/${id}`);
  return response.data;
};
