import { useBooks } from "../hooks/useBooks";
import { BookList } from "./BookList";

export function BooksPage() {
  const { books, loading, error, reload } = useBooks();

  if (loading) return <p>Cargando libros…</p>;

  if (error) {
    return (
      <div>
        <p style={{ color: "crimson" }}>Error: {error}</p>
        <button onClick={reload}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Biblioteca</h1>
      <BookList books={books} />
    </div>
  );
}
