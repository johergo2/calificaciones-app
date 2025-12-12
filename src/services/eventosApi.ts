import axios from "axios";

const API_URL = "https://api-usuarios-f1im.onrender.com/api"; // cambia si estás local

export interface Evento {
  id?: number;
  nombre: string;
  descripcion?: string;
  fecha_evento: string;
//  hora_evento: string;
  lugar?: string;
  tipo: string;
  estado: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Obtener todos los eventos
export const getEventos = async (): Promise<Evento[]> => {
  const response = await axios.get(`${API_URL}/eventos`);
  return response.data.eventos;
};

// Crear evento
export const crearEvento = async (evento: Evento) => {
  const response = await axios.post(`${API_URL}/eventos`, evento);
  return response.data;
};

// Actualizar evento
export const actualizarEvento = async (id: number, evento: Evento) => {
  const response = await axios.put(`${API_URL}/eventos/${id}`, evento);
  return response.data;
};

// Eliminar evento
export const eliminarEvento = async (id: number) => {
  const response = await axios.delete(`${API_URL}/eventos/${id}`);
  return response.data;
};
