import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import { getBooks } from "../api/booksApi"

import { getUsers } from "../api/usersApi"

import { createPrestamo } from "../api/prestamosApi"

export function NewPrestamoPage() {
  const navigate = useNavigate()

  /*
    Estados
  */

  const [users, setUsers] = useState([])

  const [books, setBooks] = useState([])

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [error, setError] = useState(null)

  /*
    Formulario
  */

  const [form, setForm] = useState({
    user_id: "",

    libro_id: "",

    estado: "activo",

    fecha_prestamo: new Date().toISOString().split("T")[0],

    fecha_devolucion: "",
  })

  /*
    Cargar datos
  */

  useEffect(() => {
    async function loadData() {
      try {
        const usersData = await getUsers()

        const booksData = await getBooks()

        setUsers(usersData)

        setBooks(booksData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /*
    Inputs
  */

  function handleChange(e) {
    const { name, value } = e.target
    setError(null)

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /*
    Submit
  */

  async function handleSubmit(e) {
    e.preventDefault()

    setSaving(true)

    try {
      await createPrestamo(form)

      navigate("/prestamos")
    } catch (err) {
      setError(err.message || "No se pudo crear el préstamo")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Cargando datos...</p>
  }

  return (
    <div className="form-page">
      <h1>Nuevo préstamo</h1>

      <form className="card form-layout" onSubmit={handleSubmit}>
        {/* ERROR PRESTAMOS*/}
        {error && <div className="form-error">{error}</div>}
        {/* USUARIO */}

        <label>
          Usuario
          <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona usuario</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nombre}
              </option>
            ))}
          </select>
        </label>

        {/* LIBRO */}

        <label>
          Libro
          <select
            name="libro_id"
            value={form.libro_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona libro</option>

            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </label>

        {/* ESTADO */}

        <label>
          Estado
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="activo">Activo</option>
            <option value="devuelto">Devuelto</option>
          </select>
        </label>

        {/* FECHA PRESTAMO */}

        <label>
          Fecha préstamo
          <input
            type="date"
            name="fecha_prestamo"
            value={form.fecha_prestamo}
            onChange={handleChange}
            required
          />
        </label>

        {/* FECHA DEVOLUCIÓN */}

        <label>
          Fecha devolución
          <input
            type="date"
            name="fecha_devolucion"
            value={form.fecha_devolucion}
            onChange={handleChange}
          />
        </label>

        {/* BOTONES */}

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Crear préstamo"}
          </button>
        </div>
      </form>
    </div>
  )
}
