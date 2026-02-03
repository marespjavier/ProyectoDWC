import { useParams, Link, useNavigate } from "react-router-dom";
import { useBookDetail } from "../hooks/useBookDetail";
import { useShelf } from "../context/ShelfContext";
import { deleteBook } from "../api/booksApi";

/*
  Página de detalle de un libro.
  Muestra la información completa del libro, su estado en la estantería
  y las reseñas asociadas.
*/
export function BookDetailPage() {
  // Obtenemos el id del libro desde la URL (/book/:id)
  const { id } = useParams();

  const navigate = useNavigate();
  // Contexto de estantería (localStorage)
  const shelf = useShelf();

  // Hook que carga el libro y sus reseñas desde la API
  const { book, reviews, loading, error } = useBookDetail(id);

  // Estado actual del libro en la estantería (pendiente, leído, favorito)
  const currentStatus = book ? shelf.getStatus(book.id) : null;

  async function handleDelete() {
    const ok = window.confirm(
      `¿Seguro que quieres eliminar "${book.title}"?\nEsta acción no se puede deshacer.`,
    );

    if (!ok) return;

    try {
      await deleteBook(book.id);

      // opcional: si estaba en estantería, lo quitamos para evitar "fantasmas"
      shelf.remove(book.id);

      navigate("/");
    } catch (err) {
      alert(err?.message ?? "No se pudo eliminar el libro.");
    }
  }

  // Estado de carga
  if (loading) return <p>Cargando libro…</p>;

  // Error al cargar el libro
  if (error) {
    return (
      <div className="card">
        <p className="error">Error: {error}</p>
        <Link to="/">Volver</Link>
      </div>
    );
  }

  // Si no existe el libro
  if (!book) return <p>Libro no encontrado</p>;

  return (
    <div>
      {/* Cabecera con información principal del libro */}
      <header className="detail-header">
        <h1>{book.title}</h1>
        <p>{book.shortDescription(300)}</p>

        {/* Ficha técnica del libro */}
        <div className="detail-meta">
          <div className="meta-item">
            <small>Autores</small>
            <div>{book.authorsText || "—"}</div>
          </div>

          <div className="meta-item">
            <small>Géneros</small>
            <div>{book.genres?.join(", ") || "—"}</div>
          </div>

          <div className="meta-item">
            <small>Idioma</small>
            <div>{book.language || "—"}</div>
          </div>

          <div className="meta-item">
            <small>Páginas</small>
            <div>{book.pages ?? "—"}</div>
          </div>

          <div className="meta-item">
            <small>Año</small>
            <div>{book.publishedYear ?? "—"}</div>
          </div>

          <div className="meta-item">
            <small>Disponibilidad</small>
            <span className="badge">{book.availabilityText}</span>
          </div>
        </div>
      </header>
      {/* Acciones principales del libro */}
      <div className="detail-actions">
        <Link className="link-action" to={`/book/${book.id}/edit`}>
          Editar libro
        </Link>

        <span className="divider">·</span>

        <button type="button" className="link-danger" onClick={handleDelete}>
          Eliminar libro
        </button>
      </div>

      {/* Gestión de estantería */}
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

      {/* Reseñas del libro */}
      <section className="card">
        <h2>Reseñas</h2>

        {reviews.length === 0 ? (
          <p>No hay reseñas todavía.</p>
        ) : (
          <ul>
            {reviews.map((r) => (
              <li key={r.id}>
                <strong>{r.user}</strong> ({r.rating}/5): {r.text}
              </li>
            ))}
          </ul>
        )}

        <div className="form-actions">
          <Link className="btn-secondary" to={`/book/${book.id}/review`}>
            Añadir reseña
          </Link>
        </div>
      </section>
    </div>
  );
}
