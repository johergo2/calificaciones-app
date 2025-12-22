import axios from "axios";

const API_URL = "https://api-usuarios-f1im.onrender.com/api"; // cambia si estás local

// Calificaciones que viene de BD
export interface Calificaciones {
  id?: number;
  cedula_jurado: string;
  cedula_participan: string,
  evento_id: number,
  categoria_id: number,
  puntaje: number,
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Obtener todas las calificaciones
export const getCalificaciones = async (): Promise<Calificaciones[]> => {
  const response = await axios.get(`${API_URL}/calificaciones`);
  return response.data.calificaciones;
};

// Crear calificacion
export const crearCalificacion = async (data: {
                                          cedula_jurado: string;
                                          cedula_participante: string;
                                          evento_id: number;
                                          categoria_id: number;
                                          puntaje: number;
}) => {
  const response = await axios.post(`${API_URL}/calificaciones`, data);
  return response.data;
};

// Actualizar calificacion
export const actualizarCalificacion = async (id: number, calificacion: Calificaciones) => {
  const response = await axios.put(`${API_URL}/calificaciones/${id}`, calificacion);
  return response.data;
};

// Eliminar calificacion
export const eliminarCalificacion = async (id: number) => {
  const response = await axios.delete(`${API_URL}/calificacion/${id}`);
  return response.data;
};
