import { useMemo, useState } from "react";

/*
  Hook personalizado para filtrar y ordenar libros.
  Mantiene los filtros en estado local y devuelve la lista filtrada.
*/

export function useBookFilters(books) {
  const [filters, setFilters] = useState({
    query: "",
    genre: "all",
    onlyAvailable: false,
    sort: "title-asc",
  });

  // Generar lista de géneros a partir de los libros (dinámico)
  const genres = useMemo(() => {
    const set = new Set();
    for (const b of books) {
      if (Array.isArray(b.genres)) {
        for (const g of b.genres) set.add(g);
      }
    }
    return ["all", ...Array.from(set).sort()];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Búsqueda: usamos método de la clase Book si existe
    const q = filters.query.trim();
    if (q) {
      result = result.filter((b) =>
        typeof b.matchesQuery === "function"
          ? b.matchesQuery(q)
          : `${b.title ?? ""} ${Array.isArray(b.authors) ? b.authors.join(" ") : ""}`
              .toLowerCase()
              .includes(q.toLowerCase()),
      );
    }

    // Género
    if (filters.genre !== "all") {
      result = result.filter(
        (b) => Array.isArray(b.genres) && b.genres.includes(filters.genre),
      );
    }

    // Ordenación
    result.sort((a, b) => {
      if (filters.sort === "title-asc")
        return (a.title ?? "").localeCompare(b.title ?? "");
      if (filters.sort === "title-desc")
        return (b.title ?? "").localeCompare(a.title ?? "");
      if (filters.sort === "year-asc")
        return (a.publishedYear ?? 0) - (b.publishedYear ?? 0);
      if (filters.sort === "year-desc")
        return (b.publishedYear ?? 0) - (a.publishedYear ?? 0);
      return 0;
    });

    return result;
  }, [books, filters]);

  function resetFilters() {
    setFilters({
      query: "",
      genre: "all",
      onlyAvailable: false,
      sort: "title-asc",
    });
  }

  return { filters, setFilters, genres, filteredBooks, resetFilters };
}
