import { useMemo, useState } from "react";

/*
  Hook filtros + ordenación libros
*/

export function useBookFilters(books) {
  /*
  |--------------------------------------------------------------------------
  | Estado filtros
  |--------------------------------------------------------------------------
  */

  const [filters, setFilters] = useState({
    query: "",

    genre: "all",

    sort: "title-asc",
  });

  /*
  |--------------------------------------------------------------------------
  | Categorías dinámicas
  |--------------------------------------------------------------------------
  */

  const genres = useMemo(() => {
    const uniqueGenres = new Set();

    books.forEach((book) => {
      if (book.category) {
        uniqueGenres.add(book.category);
      }
    });

    return ["all", ...Array.from(uniqueGenres).sort()];
  }, [books]);

  /*
  |--------------------------------------------------------------------------
  | Filtrar + ordenar
  |--------------------------------------------------------------------------
  */

  const filteredBooks = useMemo(() => {
    let result = [...books];

    /*
    |--------------------------------------------------------------------------
    | Búsqueda texto
    |--------------------------------------------------------------------------
    */

    const query = filters.query.trim().toLowerCase();

    if (query) {
      result = result.filter((book) =>
        typeof book.matchesQuery === "function"
          ? book.matchesQuery(query)
          : false,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Categoría
    |--------------------------------------------------------------------------
    */

    if (filters.genre !== "all") {
      result = result.filter((book) => book.category === filters.genre);
    }

    /*
    |--------------------------------------------------------------------------
    | Ordenación
    |--------------------------------------------------------------------------
    */

    result.sort((a, b) => {
      switch (filters.sort) {
        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "year-asc":
          return a.publishedYear - b.publishedYear;

        case "year-desc":
          return b.publishedYear - a.publishedYear;

        default:
          return 0;
      }
    });

    return result;
  }, [books, filters]);

  /*
  |--------------------------------------------------------------------------
  | Reset filtros
  |--------------------------------------------------------------------------
  */

  function resetFilters() {
    setFilters({
      query: "",

      genre: "all",

      sort: "title-asc",
    });
  }

  return {
    filters,

    setFilters,

    genres,

    filteredBooks,

    resetFilters,
  };
}
