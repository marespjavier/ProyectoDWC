"use strict"

//URL base de la API (json-server en local) en fichero config API_URL
import { API_URL } from "./config.js"

/*
    Login de usuario contra Laravel API
    POST /login
    body: { email, password }
    response: { token }
*/

export async function loginRequest(email, password) {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.message || `Error HTTP ${response.status}`
    throw new Error(message)
  }

  return data
}
