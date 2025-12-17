import axios from "axios";

//const API_URL = "http://localhost:8000/api"; // cambia si estás local
const API_URL = "https://api-usuarios-f1im.onrender.com/api"; // cambia si estás en Render.com

export interface Participante {
  id?: number;
  cedula: string;
  nombre: string;
  tipo: string | null;
  observacion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Obtener todos los participantes
export const getParticipantes = async (): Promise<Participante[]> => {
  const response = await axios.get(`${API_URL}/participantes`);
  return response.data.participantes;
};

// Crear participante
export const crearParticipante = async (evento: Participante) => {
  const response = await axios.post(`${API_URL}/participantes`, evento);
  return response.data;
};

// Actualizar participante
export const actualizarParticipante = async (id: number, evento: Participante) => {
  const response = await axios.put(`${API_URL}/participantes/${id}`, evento);
  return response.data;
};

// Eliminar participante
export const eliminarParticipante = async (id: number) => {
  const response = await axios.delete(`${API_URL}/participantes/${id}`);
  return response.data;
};
