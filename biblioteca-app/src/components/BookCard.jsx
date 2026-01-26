import { Link } from "react-router-dom";

export function BookCard({ book }) {
  return (
    <article style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
      <h3 style={{ margin: 0 }}>{book.title}</h3>
      <p style={{ margin: "6px 0" }}>
        <strong>Autor/es:</strong> {book.authors?.join(", ") || "Desconocido"}
      </p>

      <Link to={`/book/${book.id}`}>Ver detalle</Link>
    </article>
  );
}
