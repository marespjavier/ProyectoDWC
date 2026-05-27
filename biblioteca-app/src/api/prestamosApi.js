import { API_URL } from "./config"
import { Prestamo } from "../models/Prestamo"

/*
  Obtener token
*/
function getHeaders() {
  const token = localStorage.getItem("token")

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  }
}

/*
  Obtener préstamos del usuario autenticado
*/
export async function getPrestamos() {
  const response = await fetch(`${API_URL}/prestamo`, {
    headers: getHeaders(),
  })

  const data = await response.json()

  // Compatible con ambas respuestas Laravel
  const prestamos = data.data ?? data

  return prestamos.map((p) => new Prestamo(p))
}

/*
  Crear préstamo
*/

export async function createPrestamo(prestamo) {
  const response = await fetch(`${API_URL}/prestamo`, {
    method: "POST",

    headers: getHeaders(),

    body: JSON.stringify(prestamo),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "No se pudo crear el préstamo")
  }

  return data
}

/*
  Marcar préstamo como devuelto
*/
export async function devolverPrestamo(id) {
  const response = await fetch(`${API_URL}/prestamo/${id}`, {
    method: "PUT",

    headers: getHeaders(),

    body: JSON.stringify({
      estado: "devuelto",
      fecha_devolucion: new Date().toISOString().split("T")[0],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "No se pudo devolver el préstamo")
  }

  return data
}

/*
  Eliminar préstamo
*/
export async function deletePrestamo(id) {
  const response = await fetch(`${API_URL}/prestamo/${id}`, {
    method: "DELETE",

    headers: getHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "No se pudo eliminar el préstamo")
  }

  return data
}
