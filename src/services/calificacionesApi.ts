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

export interface CalificacionRanking {
  id: number;
  evento_id: string,
  evento: string;
  categoria_id: string,
  categoria: string;
  cedula_participan: string,
  participante: string;
  promedio: number;
}

export interface CalificacionTotResponse {calificacionestot: CalificacionTot[]}

export interface CalificacionTabResponse {calificacionestot: CalificacionTot[]}
export interface CalificacionRankingResponse {calificacionesranking: CalificacionRanking[]}

// Obtener todas las calificaciones
export const getCalificaciones = async (
    filtros: {
    eventoId?: number; 
    usuarioId?: number;
  }  
) => {  

  const params: any = {};

  if (filtros.eventoId) params.evento_id = filtros.eventoId;
  if (filtros.usuarioId) params.usuario_id = filtros.usuarioId;

  const response = await axios.get(`${API_URL}/calificaciones`, 
    { params }
  );

  // Normalización de respuesta (CLAVE)
  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }  

  if (Array.isArray(response.data.data)) {
    return response.data.data;
  }

  if (Array.isArray(response.data.registros)) {
    return response.data.registros;
  }

  return response.data.calificaciones;
};

// Obtener todas las calificaciones con descripciones en cada campo
export const getCalificacionestot = async (eventoId?: number, usuarioId?: number) => {  
  const params: Record<string, any> = {};

  if (eventoId) params.evento_id = eventoId;
  if (usuarioId) params.usuario_id = usuarioId;

  const response = await axios.get<CalificacionTotResponse>(
    `${API_URL}/calificacionestot`,
    { params }
  );
  return response.data;
};

// Obtener todas las calificaciones con descripciones en cada campo para la consulta (Tabla)
export const getCalificacionestab = async (
  eventoId?: number, 
  usuarioId?: number  
): Promise<CalificacionTot[]> => {  

  const params: Record<string, any> = {}

  if (eventoId) params.evento_id = eventoId;
  if (usuarioId) params.usuario_id = usuarioId;  

  const response = await axios.get<CalificacionTabResponse>(
    `${API_URL}/calificacionestot`, { params }
  );
  return response.data.calificacionestot;
};


// Obtener todas las calificaciones promedio ordenadas descendente para ver ganadores del evento
export const getCalificacionesranking = async (
  eventoId?: number, 
  usuarioId?: number  
): Promise<CalificacionRanking[]> => {  

  const params: Record<string, any> = {}

  if (eventoId) params.evento_id = eventoId;
  if (usuarioId) params.usuario_id = usuarioId; 

  const response = await axios.get<CalificacionRankingResponse>(
    `${API_URL}/calificacionesranking`, { params }
  );
  return response.data.calificacionesranking;
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

// Función para consultar si existen calificaciones promedio en la tabla
export const existenPromedios = async () => {
  const response = await fetch(
    `${API_URL}/calificaciones-promedio/existen`
  );

  if (!response.ok) {
    throw new Error("Error consultando promedios");
  }

  return response.json(); // { existen: boolean, total: number }
};


// Función para enviar al Backend las calificaciones promedio
export const insertarCalificacionesPromedio = async () => {
  const response = await fetch(
    `${API_URL}/calificaciones-promedio`, {
      method: "POST",
      }    
  );

  if (!response.ok) {
    throw new Error("Error insertando calificaciones promedio");
  }
  return await response.json();
};
