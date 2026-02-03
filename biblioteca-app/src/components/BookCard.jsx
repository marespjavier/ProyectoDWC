import { Link } from "react-router-dom";

export function BookCard({ book }) {
  return (
    <article className="card">
      <h3>{book.title}</h3>

      <p>
        <strong>Autor/es:</strong> {book.authorsText}
      </p>

      <p>
        <span className="badge">{book.availabilityText}</span>
      </p>

      <Link to={`/book/${book.id}`}>Ver detalle →</Link>
    </article>
  );
}
