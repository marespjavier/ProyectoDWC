import { useBooks } from "../hooks/useBooks";
import { BookList } from "./BookList";
import { useBookFilters } from "../hooks/useBooksFilters";

/*
  Página de listado de libros.
  - Carga libros con useBooks().
  - Aplica filtros/ordenación con useBookFilters().
*/

export function BooksPage() {
  const { books, loading, error, reload } = useBooks();
  const { filters, setFilters, genres, filteredBooks, resetFilters } =
    useBookFilters(books);

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
      <div className="controls">
        <input
          placeholder="Buscar por título, autor o palabra clave..."
          value={filters.query}
          onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
        />

        <label>
          Género:{" "}
          <select
            value={filters.genre}
            onChange={(e) =>
              setFilters((f) => ({ ...f, genre: e.target.value }))
            }
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g === "all" ? "Todos" : g}
              </option>
            ))}
          </select>
        </label>

        <label>
          Orden:{" "}
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort: e.target.value }))
            }
          >
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
            <option value="year-desc">Año (nuevo → antiguo)</option>
            <option value="year-asc">Año (antiguo → nuevo)</option>
          </select>
        </label>

        <button onClick={resetFilters}>Limpiar filtros</button>
      </div>

      <p>
        Mostrando <strong>{filteredBooks.length}</strong> de{" "}
        <strong>{books.length}</strong> libros
      </p>

      <BookList books={filteredBooks} />
    </div>
  );
}
