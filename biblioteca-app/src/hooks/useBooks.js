'use strict';

import { useEffect, useState } from "react";
import { getBooks } from "../api/booksApi";

/**
 * Hook para cargar libros desde la API.
 * Devuelve datos + estados y una función para recargar.
 */
export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);   // empieza en true para la primera carga
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);  // truco simple para forzar recarga

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getBooks();
        if (!cancelled) setBooks(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // evita setState si el componente se desmonta
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  return { books, loading, error, reload };
}
