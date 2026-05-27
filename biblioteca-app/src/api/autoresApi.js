import { API_URL } from "./config"

function getHeaders() {
  const token = localStorage.getItem("token")

  return {
    Accept: "application/json",

    Authorization: `Bearer ${token}`,
  }
}

/*
|--------------------------------------------------------------------------
| Obtener autores
|--------------------------------------------------------------------------
*/

export async function getAutores() {
  const response = await fetch(`${API_URL}/autor`, {
    headers: getHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "No se pudieron cargar los autores")
  }

  return data.data ?? data
}
