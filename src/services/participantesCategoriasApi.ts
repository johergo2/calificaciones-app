import axios from "axios";

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
  eventoId?: number,
  cedula?: string
): Promise<ParticipanteCategoriaEvento[]> => {

  const params: any = {};
  if (eventoId) params.evento_id = eventoId;
  if (cedula) params.cedula = cedula;

  const response = await axios.get(
    `${API_URL}/participantes-categorias-eventos`,
    { params }
  );

  return response.data.data;
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

export const getCategoriasPorParticipanteEvento = async (
  cedula: string,
  eventoId: number
) => {
  const response = await axios.get(
    `${API_URL}/participantes/${cedula}/eventos/${eventoId}/categorias`
  );

  return response.data.categorias;
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
