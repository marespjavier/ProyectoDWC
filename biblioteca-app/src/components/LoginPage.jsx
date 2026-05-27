"use strict"

import { useState } from "react"
import { useAuth } from "../hooks/useAuth.js"

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    setError("")

    try {
      await login(email, password)

      // Redirección automática al inicio
      window.location.href = "/"
    } catch (err) {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit">Entrar</button>
          </div>

          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  )
}
