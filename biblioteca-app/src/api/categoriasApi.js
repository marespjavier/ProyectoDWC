import { API_URL } from "./config";

function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",

    Authorization: `Bearer ${token}`,
  };
}

/*
|--------------------------------------------------------------------------
| Obtener categorías
|--------------------------------------------------------------------------
*/

export async function getCategorias() {
  const response = await fetch(`${API_URL}/categoria`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "No se pudieron cargar las categorías");
  }

  return data.data ?? data;
}
