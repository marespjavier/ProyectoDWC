import { Link } from "react-router-dom";

/*
  Tarjeta de libro usada en listados.
  Muestra datos mínimos y un enlace al detalle.
*/

export function BookCard({ book }) {
  return (
    <article className="card">
      <h3>{book.title}</h3>

      <p>
        <strong>Autor/es:</strong> {book.authorsText}
      </p>

      <Link to={`/book/${book.id}`}>Ver detalle →</Link>
    </article>
  );
}
