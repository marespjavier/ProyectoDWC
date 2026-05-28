import { API_URL } from "./config";

/*
  Headers autenticación
*/

function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/*
  Obtener usuarios
*/

export async function getUsers() {
  const response = await fetch(`${API_URL}/user`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "No se pudieron cargar usuarios");
  }

  /*
  |--------------------------------------------------------------------------
  | Compatible Laravel
  |--------------------------------------------------------------------------
  */

  return data.data ?? data;
}

/*
|--------------------------------------------------------------------------
| Obtener usuario por ID
|--------------------------------------------------------------------------
*/

export async function getUser(id) {
  const response = await fetch(`${API_URL}/user/${id}`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Error obteniendo usuario");
  }

  return data.data;
}

/*
|--------------------------------------------------------------------------
| Crear usuario
|--------------------------------------------------------------------------
*/

export async function createUser(user) {
  const response = await fetch(`${API_URL}/user`, {
    method: "POST",

    headers: getHeaders(),

    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "No se pudo crear el usuario");
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Eliminar usuario
|--------------------------------------------------------------------------
*/

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",

    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Error eliminando usuario");
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Actualizar usuario
|--------------------------------------------------------------------------
*/

export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: "PUT",

    headers: getHeaders(),

    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Error actualizando usuario");
  }

  return data.data;
}
