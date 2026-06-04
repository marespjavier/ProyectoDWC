"use strict";

import { Link } from "react-router-dom";

/*
  Tarjeta individual libro
*/

export function BookCard({ book }) {
  const token = localStorage.getItem("token");

  return (
    <article className="book-card">
      {/* PORTADA */}

      <img
        src={book.image || "https://placehold.co/300x450?text=Libro"}
        alt={book.title}
        className="book-cover"
      />

      {/* CONTENIDO */}

      <div className="book-content">
        {/* DISPONIBILIDAD */}

        <div className="book-status">
          {book.disponible ? (
            <span className="status-badge status-disponible">Disponible</span>
          ) : (
            <span className="status-badge status-no-disponible">Prestado</span>
          )}
        </div>

        {/* TÍTULO */}

        <h2>{book.title}</h2>

        {/* AUTOR */}

        <p>
          <strong>Autor:</strong> {book.author}
        </p>

        {/* CATEGORÍA */}

        <p>
          <strong>Categoría:</strong> {book.category}
        </p>

        {/* AÑO */}

        <p>
          <strong>Año:</strong> {book.yearText}
        </p>

        {/* BOTÓN */}

        <div className="form-actions">
          {token ? (
            <Link to={`/libro/${book.id}`} className="btn-secondary">
              Ver detalle
            </Link>
          ) : (
            <p className="login-warning">Inicia sesión para más información</p>
          )}
        </div>
      </div>
    </article>
  );
}
