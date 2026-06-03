import { useState } from "react";

import { useBooks } from "../hooks/useBooks";
import { useShelf } from "../context/ShelfContext";

import { Link } from "react-router-dom";

import { Loader } from "./Loader";
import { ConfirmModal } from "./ConfirmModal";

export function ShelfPage({ embedded = false }) {
  const { books, loading, error } = useBooks();

  const shelf = useShelf();

  if (loading) {
    return <Loader text="Cargando estantería..." />;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  if (shelf.items.length === 0) {
    return (
      <div className="empty-shelf">
        <h1>Mi estantería</h1>

        <p>No tienes libros guardados todavía.</p>

        <Link to="/" className="btn-secondary">
          Explorar biblioteca
        </Link>
      </div>
    );
  }

  const bookById = new Map(
    books.map((book) => [Number(book.id), book]),
  );

  const groups = {
    favorito: [],
    pendiente: [],
    leido: [],
  };

  for (const item of shelf.items) {
    const book = bookById.get(Number(item.bookId));

    if (book) {
      groups[item.status].push({
        item,
        book,
      });
    }
  }

  return (
    <div>
      <h1>Mi estantería</h1>

      <div className="history-stats">
        <article className="history-stat-card blue">
          <h3>{groups.favorito.length}</h3>
          <p>Favoritos</p>
        </article>

        <article className="history-stat-card orange">
          <h3>{groups.pendiente.length}</h3>
          <p>Pendientes</p>
        </article>

        <article className="history-stat-card green">
          <h3>{groups.leido.length}</h3>
          <p>Leídos</p>
        </article>
      </div>

      <ShelfSection
        title="⭐ Favoritos"
        items={groups.favorito}
      />

      <ShelfSection
        title="📖 Pendientes"
        items={groups.pendiente}
      />

      <ShelfSection
        title="✅ Leídos"
        items={groups.leido}
      />
    </div>
  );
}

function ShelfSection({
  title,
  items,
}) {
  const shelf = useShelf();

  const [selectedBook, setSelectedBook] =
    useState(null);

  return (
    <>
      <section style={{ marginTop: "2rem" }}>
        <h2>{title}</h2>

        {items.length === 0 ? (
          <p>No hay libros.</p>
        ) : (
          <div className="books-grid">
            {items.map(({ book, item }) => (
              <article
                key={book.id}
                className="book-card"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="book-cover"
                />

                <div className="book-card-content">
                  <h3>{book.title}</h3>

                  <p>{book.author}</p>

                  <small>
                    Añadido el {item.addedAt}
                  </small>

                  <div
                    className="form-actions"
                    style={{
                      marginTop: "1rem",
                    }}
                  >
                    <Link
                      to={`/libro/${book.id}`}
                      className="btn-secondary"
                    >
                      Ver libro
                    </Link>

                    <button
                      className="btn-danger"
                      onClick={() =>
                        setSelectedBook(book)
                      }
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ConfirmModal
        open={!!selectedBook}
        title="Quitar de la estantería"
        message={
          selectedBook
            ? `¿Deseas eliminar "${selectedBook.title}" de tu estantería?`
            : ""
        }
        confirmText="Quitar"
        onConfirm={() => {
          shelf.remove(selectedBook.id);

          setSelectedBook(null);
        }}
        onCancel={() =>
          setSelectedBook(null)
        }
      />
    </>
  );
}