import { useState } from "react"

/*
|--------------------------------------------------------------------------
| Formulario usuario
|--------------------------------------------------------------------------
*/

export function UserForm({ onSubmit, submitText, initialValues, disabled }) {
  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  const [nombre, setNombre] = useState(initialValues?.nombre ?? "")

  const [email, setEmail] = useState(initialValues?.email ?? "")

  const [telefono, setTelefono] = useState(initialValues?.telefono ?? "")

  const [direccion, setDireccion] = useState(initialValues?.direccion ?? "")

  const [password, setPassword] = useState("")

  const [role, setRole] = useState(initialValues?.role ?? "Usuario")

  const [error, setError] = useState(null)

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(e) {
    e.preventDefault()

    setError(null)

    /*
    |--------------------------------------------------------------------------
    | Validaciones
    |--------------------------------------------------------------------------
    */

    if (!nombre.trim()) {
      return setError("El nombre es obligatorio.")
    }

    if (!email.trim()) {
      return setError("El email es obligatorio.")
    }

    /*
    |--------------------------------------------------------------------------
    | Password obligatoria SOLO al crear
    |--------------------------------------------------------------------------
    */

    if (!initialValues && !password.trim()) {
      return setError("La contraseña es obligatoria.")
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | Objeto usuario
      |--------------------------------------------------------------------------
      */

      const userData = {
        nombre,

        email,

        role,

        telefono,

        direccion,
      }

      /*
      |--------------------------------------------------------------------------
      | Solo enviar password si existe
      |--------------------------------------------------------------------------
      */

      if (password.trim()) {
        userData.password = password
      }

      await onSubmit(userData)
    } catch (err) {
      setError(err.message ?? "No se pudo guardar el usuario.")
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{submitText ?? "Guardar usuario"}</h2>

      {error && <div className="form-error">{error}</div>}

      {/* NOMBRE */}

      <div className="form-row">
        <label>Nombre</label>

        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* EMAIL */}

      <div className="form-row">
        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* ROL */}

      <div className="form-row">
        <label>Rol</label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={disabled}
        >
          <option value="Usuario">Usuario</option>

          <option value="Bibliotecario">Bibliotecario</option>
        </select>
      </div>

      {/* TELÉFONO */}

      <div className="form-row">
        <label>Teléfono</label>

        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* DIRECCIÓN */}

      <div className="form-row">
        <label>Dirección</label>

        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* PASSWORD */}

      <div className="form-row">
        <label>Contraseña</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={disabled}
          placeholder={
            initialValues ? "Dejar vacío para mantener la actual" : ""
          }
        />
      </div>

      {/* ACTIONS */}

      <div className="form-actions">
        <button type="submit" disabled={disabled}>
          {submitText ?? "Guardar"}
        </button>
      </div>
    </form>
  )
}
