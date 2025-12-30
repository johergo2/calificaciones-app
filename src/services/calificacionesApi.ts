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

export interface CalificacionTot {
  id: number;
  cedula_jurado: string,
  jurado: string;
  evento_id: string,
  evento: string;
  categoria_id: string,
  categoria: string;
  cedula_participan: string,
  participante: string;
  puntaje: number;
}

export interface CalificacionTotResponse {calificacionestot: CalificacionTot[]}

export interface CalificacionTabResponse {calificacionestot: CalificacionTot[]}

// Obtener todas las calificaciones
export const getCalificaciones = async (eventoId?: number) => {  
  const response = await axios.get(`${API_URL}/calificaciones`, {
    params: eventoId ? {evento_id: eventoId } : {},
  });
  return response.data.calificaciones;
};

// Obtener todas las calificaciones con descripciones en cada campo
export const getCalificacionestot = async (eventoId?: number) => {  
  const url = eventoId
    ? `${API_URL}/calificacionestot?evento_id=${eventoId}`
    : `${API_URL}/calificacionestot`;

  const response = await axios.get<CalificacionTotResponse>(url);
  return response.data;
};

// Obtener todas las calificaciones con descripciones en cada campo para la consulta (Tabla)
export const getCalificacionestab = async (): Promise<CalificacionTot[]> => {  
  const response = await axios.get<CalificacionTabResponse>(`${API_URL}/calificacionestot`);
  return response.data.calificacionestot;
};

// Crear calificacion
export const crearCalificacion = async (data: {
                                          cedula_jurado: string;
                                          cedula_participan: string;
                                          evento_id: number;
                                          categoria_id: number;
                                          puntaje: number;
                                        }) => {
  console.log("📤 Datos enviados a la API /calificaciones:", data);                                            
  const response = await axios.post(`${API_URL}/calificaciones`, data);
  console.log("📥 Respuesta de la API:", response.data);
  return response.data;
};

//Obtener ID de la tabla calificaciones
export const getCalificacionById = async (id: number) => {
  const res = await fetch(`${API_URL}/calificaciones/${id}`);
  return res.json();
};
// Actualizar calificación del ID obtenido en la anterior
export const updateCalificacion = async (id: number, data: any) => {
  await fetch(`${API_URL}/calificaciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};


// Actualizar calificacion
export const actualizarCalificacion = async (id: number, calificacion: Calificaciones) => {
  const response = await axios.put(`${API_URL}/calificaciones/${id}`, calificacion);
  return response.data;
};

// Eliminar calificacion
export const eliminarCalificacion = async (id: number) => {
  const response = await axios.delete(`${API_URL}/calificaciones/${id}`);
  return response.data;
};
