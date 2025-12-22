import axios from "axios";

const API_URL = "https://api-usuarios-f1im.onrender.com/api";

/* =====================================================
   Interfaces
===================================================== */

export interface JuradoCategoriaEvento {
  id?: number;
  cedula: string;
  jurado?: string;
  evento_id: number;
  evento?: string;
  categoria_id: number;
  categoria?: string;
  fecha_creacion?: string;
}

/* =====================================================
   1. Listar jurados
   (opcionalmente por evento o jurado)
===================================================== */

export const getJuradosCategoriasEventos = async (
  eventoId?: number,
  cedula?: string
): Promise<JuradoCategoriaEvento[]> => {

  const params: Record<string, any> = {};
  if (eventoId) params.evento_id = eventoId;
  if (cedula) params.cedula = cedula;

  const response = await axios.get(
    `${API_URL}/jurados-categorias-eventos`,
    { params }
  );

  // 🔒 Normalización de respuesta (CLAVE)
  if (Array.isArray(response.data)) {
    return response.data;
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
   2. Asignar jurado a categorías de un evento
===================================================== */

export interface AsignarJuradoPayload {
  cedula: string;
  evento_id: number;
  categorias: number[];
}

export const asignarJuradoCategorias = async (
  payload: AsignarJuradoPayload
) => {
  const response = await axios.post(
    `${API_URL}/jurados-categorias-eventos`,
    payload
  );

  return response.data;
};

/* =====================================================
   3. Obtener categorías de un jurado en un evento
===================================================== */

export interface CategoriaAsignada {
  id: number;
  categoria: string;
}

export const getCategoriasPorJuradoEvento = async (
  cedula: string,
  eventoId: number
): Promise<CategoriaAsignada[]> => {
  const response = await axios.get(
    `${API_URL}/jurados/${cedula}/eventos/${eventoId}/categorias`
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
   4. Eliminar una categoría de un jurado
===================================================== */

export const eliminarCategoriaJurado = async (
  cedula: string,
  eventoId: number,
  categoriaId: number
) => {
  const response = await axios.delete(
    `${API_URL}/jurados/${cedula}/eventos/${eventoId}/categorias/${categoriaId}`
  );

  return response.data;
};

/* =====================================================
   5. Eliminar TODAS las categorías de un jurado
===================================================== */

export const eliminarJuradoEvento = async (
  cedula: string,
  eventoId: number
) => {
  const response = await axios.delete(
    `${API_URL}/jurados/${cedula}/eventos/${eventoId}`
  );

  return response.data;
};
