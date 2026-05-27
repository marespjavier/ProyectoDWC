import { Link } from "react-router-dom"

import { useBooks } from "../hooks/useBooks"

import { BookList } from "./BookList"

import { useBookFilters } from "../hooks/useBooksFilters"

import { FiSearch, FiFilter, FiRotateCcw } from "react-icons/fi"

import { canManageBooks } from "../utils/auth"

/*
|--------------------------------------------------------------------------
| Página listado libros
|--------------------------------------------------------------------------
|
| - Carga libros desde API
| - Aplica filtros y ordenación
| - Renderiza listado
|
*/

export function BooksPage() {
  const { books, loading, error, reload } = useBooks()

  const { filters, setFilters, genres, filteredBooks, resetFilters } =
    useBookFilters(books)

  /*
  |--------------------------------------------------------------------------
  | Auth
  |--------------------------------------------------------------------------
  */

  const token = localStorage.getItem("token")

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <p>Cargando libros…</p>
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div>
        <p style={{ color: "crimson" }}>Error: {error}</p>

        <button onClick={reload}>Reintentar</button>
      </div>
    )
  }

  return (
    <div>
      {/* HEADER */}

      <div className="page-header">
        <h1>Biblioteca</h1>

        {canManageBooks() && (
          <Link to="/libro/new" className="btn-primary">
            + Nuevo libro
          </Link>
        )}
      </div>

      {/* TOOLBAR */}

      <div className="books-toolbar">
        {/* SEARCH */}

        <div className="toolbar-search">
          <FiSearch />

          <input
            placeholder="Buscar libros..."
            value={filters.query}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,

                query: e.target.value,
              }))
            }
          />
        </div>

        {/* FILTERS */}

        <div className="toolbar-filters">
          {/* GÉNERO */}

          <div className="toolbar-select">
            <FiFilter />

            <select
              value={filters.genre}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,

                  genre: e.target.value,
                }))
              }
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g === "all" ? "Todos" : g}
                </option>
              ))}
            </select>
          </div>

          {/* ORDEN */}

          <div className="toolbar-select">
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,

                  sort: e.target.value,
                }))
              }
            >
              <option value="title-asc">Título (A-Z)</option>

              <option value="title-desc">Título (Z-A)</option>

              <option value="year-desc">Año (nuevo → antiguo)</option>

              <option value="year-asc">Año (antiguo → nuevo)</option>
            </select>
          </div>

          {/* RESET */}

          <button className="toolbar-reset" onClick={resetFilters}>
            <FiRotateCcw />
            Limpiar
          </button>
        </div>
      </div>

      {/* RESULTS */}

      <p>
        Mostrando <strong>{filteredBooks.length}</strong> de{" "}
        <strong>{books.length}</strong> libros
      </p>

      {/* LIST */}

      <BookList books={filteredBooks} />
    </div>
  )
}
