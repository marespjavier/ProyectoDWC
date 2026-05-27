import { useParams, Link, useNavigate } from "react-router-dom"

import { useState } from "react"

import { useBookDetail } from "../hooks/useBookDetail"

import { useShelf } from "../context/ShelfContext"

import { deleteBook } from "../api/booksApi"

import { canManageBooks, isUsuario } from "../utils/auth"

import { ConfirmModal } from "./ConfirmModal"

/*
|--------------------------------------------------------------------------
| Página detalle libro
|--------------------------------------------------------------------------
*/

export function BookDetailPage() {
  /*
  |--------------------------------------------------------------------------
  | Params
  |--------------------------------------------------------------------------
  */

  const { id } = useParams()

  const navigate = useNavigate()

  /*
  |--------------------------------------------------------------------------
  | Estantería
  |--------------------------------------------------------------------------
  */

  const shelf = useShelf()

  /*
  |--------------------------------------------------------------------------
  | Cargar libro
  |--------------------------------------------------------------------------
  */

  const { book, reviews, loading, error } = useBookDetail(id)

  /*
  |--------------------------------------------------------------------------
  | Estado estantería
  |--------------------------------------------------------------------------
  */

  const currentStatus = book ? shelf.getStatus(book.id) : null

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  /*
  |--------------------------------------------------------------------------
  | Eliminar libro
  |--------------------------------------------------------------------------
  */

  async function handleDelete() {
    try {
      await deleteBook(book.id)

      shelf.remove(book.id)

      navigate("/")
    } catch (err) {
      alert(err?.message ?? "No se pudo eliminar el libro.")
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Estado carga
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <p>Cargando libro…</p>
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="card">
        <p className="error">Error: {error}</p>

        <Link to="/">Volver</Link>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Libro no encontrado
  |--------------------------------------------------------------------------
  */

  if (!book) {
    return <p>Libro no encontrado</p>
  }

  return (
    <div>
      {/* HEADER */}

      <header className="book-detail-layout">
        {/* PORTADA */}

        <div className="book-detail-cover">
          <img
            src={book.image}
            alt={book.title}
            className="book-detail-image"
          />
        </div>

        {/* CONTENIDO */}

        <div className="book-detail-content">
          <h1>{book.title}</h1>

          <p>{book.shortDescription(300)}</p>

          {/* META */}

          <div className="detail-meta">
            <div className="meta-item">
              <small>Autor</small>

              <div>{book.author || "—"}</div>
            </div>

            <div className="meta-item">
              <small>Categoría</small>

              <div>{book.category || "—"}</div>
            </div>

            <div className="meta-item">
              <small>ISBN</small>

              <div>{book.isbn || "—"}</div>
            </div>

            <div className="meta-item">
              <small>Año</small>

              <div>{book.publishedYear ?? "—"}</div>
            </div>
          </div>
        </div>
      </header>

      {/* ACCIONES ADMIN */}

      {canManageBooks() && (
        <div className="detail-actions">
          <Link className="link-action" to={`/libro/${book.id}/edit`}>
            Editar libro
          </Link>

          <span className="divider">·</span>

          <button
            type="button"
            className="link-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Eliminar libro
          </button>
        </div>
      )}

      {/* ESTANTERÍA */}

      <section className="card" style={{ marginBottom: 12 }}>
        <h2>Estantería</h2>

        {currentStatus ? (
          <p>
            Estado actual: <strong>{currentStatus}</strong>
          </p>
        ) : (
          <p>Este libro no está en tu estantería.</p>
        )}

        <div className="form-actions">
          <button onClick={() => shelf.upsert(book.id, "pendiente")}>
            Pendiente
          </button>

          <button onClick={() => shelf.upsert(book.id, "leido")}>Leído</button>

          <button onClick={() => shelf.upsert(book.id, "favorito")}>
            Favorito
          </button>

          {currentStatus && (
            <button
              className="btn-secondary"
              onClick={() => shelf.remove(book.id)}
            >
              Quitar
            </button>
          )}
        </div>
      </section>

      {/* RESEÑAS */}

      <section className="card">
        <h2>Reseñas</h2>

        {reviews.length === 0 ? (
          <p>No hay reseñas todavía.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((r) => (
              <article key={r.id} className="review-card">
                {/* HEADER */}

                <div className="review-header">
                  {/* AVATAR */}

                  <img
                    src={r.userAvatar ?? "https://i.pravatar.cc/100"}
                    alt={r.user}
                    className="review-avatar"
                  />

                  {/* INFO */}

                  <div>
                    <strong>{r.user}</strong>

                    <p>⭐ {r.rating}/5</p>
                  </div>
                </div>

                {/* TEXTO */}

                <p className="review-text">{r.text}</p>

                {/* FECHA */}

                <small className="review-date">{r.createdAt}</small>
              </article>
            ))}
          </div>
        )}

        <div className="form-actions">
          <Link className="btn-secondary" to={`/libro/${book.id}/review`}>
            Añadir reseña
          </Link>
        </div>
      </section>
      <ConfirmModal
        open={showDeleteModal}
        title="Eliminar libro"
        message={`¿Seguro que quieres eliminar "${book.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
