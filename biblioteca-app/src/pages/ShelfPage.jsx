import { useBooks } from "../hooks/useBooks";
import { useShelf } from "../context/ShelfContext";
import { Link } from "react-router-dom";

export function ShelfPage() {
  const { books, loading, error } = useBooks();
  const shelf = useShelf();

  if (loading) return <p>Cargando estantería…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;

  if (shelf.items.length === 0) {
    return (
      <div>
        <h1>Mi estantería</h1>
        <p>No tienes libros guardados todavía.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  // join: map por id para buscar rápido
  const bookById = new Map(books.map((b) => [b.id, b]));

  // agrupamos por estado
  const groups = {
    favorito: [],
    pendiente: [],
    leido: []
  };

  for (const item of shelf.items) {
    const book = bookById.get(item.bookId);
    if (book) groups[item.status].push({ item, book });
  }

  return (
    <div>
      <h1>Mi estantería</h1>

      <Section title="Favoritos" items={groups.favorito} />
      <Section title="Pendientes" items={groups.pendiente} />
      <Section title="Leídos" items={groups.leido} />
    </div>
  );
}

function Section({ title, items }) {
  return (
    <section style={{ marginBottom: 16 }}>
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p>Sin libros en esta sección.</p>
      ) : (
        <ul>
          {items.map(({ book, item }) => (
            <li key={book.id}>
              <Link to={`/book/${book.id}`}>{book.title}</Link>{" "}
              <small>(añadido: {item.addedAt})</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
