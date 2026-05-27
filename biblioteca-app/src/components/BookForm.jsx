import { useState, useEffect, act } from "react"

import { getAutores } from "../api/autoresApi"

import { getCategorias } from "../api/categoriasApi"

/*
|--------------------------------------------------------------------------
| Formulario libros
|--------------------------------------------------------------------------
|
| - Crear libro
| - Editar libro
| - Cargar autores y categorías dinámicamente
|
*/

export function BookForm({ onAdd, disabled, initialValues, submitText }) {
  const currentYear = new Date().getFullYear()

  /*
  |--------------------------------------------------------------------------
  | Estados formulario
  |--------------------------------------------------------------------------
  */

  const [title, setTitle] = useState(initialValues?.title ?? "")

  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  )

  const [isbn, setIsbn] = useState(initialValues?.isbn ?? "")

  const [publishedYear, setPublishedYear] = useState(
    initialValues?.publishedYear ? String(initialValues.publishedYear) : "",
  )

  /*
  |--------------------------------------------------------------------------
  | Relaciones
  |--------------------------------------------------------------------------
  */

  const [authorId, setAuthorId] = useState(initialValues?.authorId ?? "")

  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "")

  /*
  |--------------------------------------------------------------------------
  | Datos dinámicos
  |--------------------------------------------------------------------------
  */

  const [autores, setAutores] = useState([])

  const [categorias, setCategorias] = useState([])

  /*
  |--------------------------------------------------------------------------
  | Estados auxiliares
  |--------------------------------------------------------------------------
  */

  const [formError, setFormError] = useState(null)

  /*
  |--------------------------------------------------------------------------
  | Cargar autores y categorías
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadData() {
      try {
        const autoresData = await getAutores()

        const categoriasData = await getCategorias()

        setAutores(autoresData)

        setCategorias(categoriasData)
      } catch (err) {
        console.error(err)
      }
    }

    loadData()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | Submit formulario
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(e) {
    e.preventDefault()

    setFormError(null)

    const t = title.trim()

    const d = description.trim()

    const i = isbn.trim()

    /*
    |--------------------------------------------------------------------------
    | Validaciones
    |--------------------------------------------------------------------------
    */

    if (!t) {
      return setFormError("El título es obligatorio.")
    }

    if (!d) {
      return setFormError("La descripción es obligatoria.")
    }

    if (!i) {
      return setFormError("El ISBN es obligatorio.")
    }

    if (!authorId) {
      return setFormError("Debes seleccionar un autor.")
    }

    if (!categoryId) {
      return setFormError("Debes seleccionar una categoría.")
    }

    let yearValue = null

    if (publishedYear.trim()) {
      const yearNum = Number(publishedYear)

      if (Number.isNaN(yearNum)) {
        return setFormError("El año debe ser numérico.")
      }

      if (yearNum > currentYear) {
        return setFormError("El año no puede ser futuro.")
      }

      yearValue = yearNum
    }

    /*
    |--------------------------------------------------------------------------
    | Objeto Laravel
    |--------------------------------------------------------------------------
    */

    const book = {
      titulo: t,

      descripcion: d,

      isbn: i,

      anyo_publicacion: yearValue,

      autor_id: Number(authorId),

      categoria_id: Number(categoryId),
    }

    try {
      await onAdd(book)
    } catch (err) {
      setFormError(err?.message ?? "No se pudo guardar el libro.")
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-layout">
        <h2>{submitText ?? "Guardar libro"}</h2>

        {/* ERROR */}

        {formError && <div className="form-error">{formError}</div>}

        {/* TÍTULO */}

        <div className="form-row">
          <label>Título</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* ISBN */}

        <div className="form-row">
          <label>ISBN</label>

          <input
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* DESCRIPCIÓN */}

        <div className="form-row">
          <label>Descripción</label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* AÑO */}

        <div className="form-row">
          <label>Año publicación</label>

          <input
            type="number"
            min={1800}
            max={currentYear}
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* AUTOR */}

        <div className="form-row">
          <label>Autor</label>

          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            disabled={disabled}
          >
            <option value="">Selecciona un autor</option>

            {autores.map((autor) => (
              <option key={autor.id} value={autor.id}>
                {autor.nombre} {autor.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORÍA */}

        <div className="form-row">
          <label>Categoría</label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={disabled}
          >
            <option value="">Selecciona una categoría</option>

            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* BOTÓN */}

        <div className="form-actions">
          <button type="submit" disabled={disabled}>
            {submitText ?? "Guardar"}
          </button>
        </div>
      </div>
    </form>
  )
}
