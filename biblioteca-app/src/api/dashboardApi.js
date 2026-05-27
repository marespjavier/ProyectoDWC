import { API_URL } from "./config"

/*
|--------------------------------------------------------------------------
| Obtener headers auth
|--------------------------------------------------------------------------
*/

function getHeaders() {
  const token = localStorage.getItem("token")

  return {
    Accept: "application/json",

    Authorization: `Bearer ${token}`,
  }
}

/*
|--------------------------------------------------------------------------
| Obtener estadísticas dashboard
|--------------------------------------------------------------------------
*/

export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: getHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "Error cargando dashboard")
  }

  return data.data
}
