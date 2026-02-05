import { useEffect, useState } from "react";
import { getBookById, getReviewsByBookId } from "../api/booksApi";

/*
  Hook personalizado: carga el detalle de un libro + sus reseñas.
  Se encarga de estados de carga, error y cancelación al desmontar.
*/

export function useBookDetail(bookId) {
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const bookData = await getBookById(bookId);
        const reviewsData = await getReviewsByBookId(bookId);

        if (!cancelled) {
          setBook(bookData);
          setReviews(reviewsData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  return { book, reviews, loading, error };
}
