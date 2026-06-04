"use strict";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useDocumentTitle("LibCloud - Iniciar sesión");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      await login(email, password);

      // Redirección automática al inicio
      window.location.href = "/";
    } catch (err) {
      setError("Las credenciales introducidas no son válidas.");
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
  );
}
