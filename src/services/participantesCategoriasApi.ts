import axios from "axios";
import { data } from "react-router-dom";

const API_URL = "https://api-usuarios-f1im.onrender.com/api";

/* =====================================================
   Interfaces
===================================================== */

export interface ParticipanteCategoriaEvento {
  id?: number;
  cedula: string;
  participante?: string;
  evento_id: number;
  evento?: string;
  categoria_id: number;
  categoria?: string;
  fecha_creacion?: string;
}

/* =====================================================
   1. Listar participaciones
   (opcionalmente por evento o participante)
===================================================== */

export const getParticipantesCategoriasEventos = async (
    filtros: {
    eventoId?: number;
    cedula?: string;
    usuarioId?: number;
  }
) => {

  const params: any = {};

  if (filtros.eventoId) params.evento_id = filtros.eventoId;
  if (filtros.cedula) params.cedula = filtros.cedula;
  if (filtros.usuarioId) params.usuario_id = filtros.usuarioId;

  const response = await axios.get(
    `${API_URL}/participantes-categorias-eventos`,
    { params }
  );

  // 🔒 Normalización de respuesta (CLAVE)
  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response.data.data)) {
    return response.data.data;
  }

  if (Array.isArray(response.data.registros)) {
    return response.data.registros;
  }

  return [];
};

/* =====================================================
   2. Asignar participante a categorías de un evento
===================================================== */

export interface AsignarParticipantePayload {
  cedula: string;
  evento_id: number;
  categorias: number[];
}

export const asignarParticipanteCategorias = async (
  payload: AsignarParticipantePayload
) => {
  const response = await axios.post(
    `${API_URL}/participantes-categorias-eventos`,
    payload
  );

  return response.data;
};

/* =====================================================
   3. Obtener categorías de un participante en un evento
===================================================== */

export interface CategoriaAsignada {
  id: number;
  categoria: string;
}

export const getCategoriasPorParticipanteEvento = async (
  cedula: string,
  eventoId: number
): Promise<CategoriaAsignada[]> => {
  const response = await axios.get(
    `${API_URL}/participantes/${cedula}/eventos/${eventoId}/categorias`
  );

  // Normalizar respuesta
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data.categorias)) {
    return response.data.categorias;
  }

  return [];
};

/* =====================================================
   4. Eliminar una categoría de un participante
===================================================== */

export const eliminarCategoriaParticipante = async (
  cedula: string,
  eventoId: number,
  categoriaId: number
) => {
  const response = await axios.delete(
    `${API_URL}/participantes/${cedula}/eventos/${eventoId}/categorias/${categoriaId}`
  );

  return response.data;
};

/* =====================================================
   5. Eliminar TODAS las categorías de un participante
===================================================== */

export const eliminarParticipanteEvento = async (
  cedula: string,
  eventoId: number
) => {
  const response = await axios.delete(
    `${API_URL}/participantes/${cedula}/eventos/${eventoId}`
  );

  return response.data;
};
