import { useParams, Link } from "react-router-dom";
import { useBookDetail } from "../hooks/useBookDetail";
import { useShelf } from "../context/ShelfContext";

export function BookDetailPage() {
  const { id } = useParams();

  const shelf = useShelf();
  const { book, reviews, loading, error } = useBookDetail(id);

  const currentStatus = book ? shelf.getStatus(book.id) : null;

  if (loading) return <p>Cargando libro…</p>;

  if (error) {
    return (
      <div>
        <p style={{ color: "crimson" }}>Error: {error}</p>
        <Link to="/">Volver</Link>
      </div>
    );
  }

  if (!book) return <p>Libro no encontrado</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.shortDescription(300)}</p>

      <h2>Estantería</h2>
      {currentStatus ? (
        <p>Estado actual: <strong>{currentStatus}</strong></p>
      ) : (
        <p>Este libro no está en tu estantería.</p>
      )}

      <button onClick={() => shelf.upsert(book.id, "pendiente")}>Pendiente</button>
      <button onClick={() => shelf.upsert(book.id, "leido")}>Leído</button>
      <button onClick={() => shelf.upsert(book.id, "favorito")}>Favorito</button>
      {currentStatus && (
        <button onClick={() => shelf.remove(book.id)}>Quitar</button>
      )}

      <hr />
      <h2>Reseñas</h2>
      <ul>
        {reviews.map((r) => (
          <li key={r.id}>{r.user} ({r.rating}/5): {r.text}</li>
        ))}
      </ul>
    </div>
  );
}
