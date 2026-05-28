import { useEffect, useState } from "react";

import { getBookById, getReviewsByBookId } from "../api/booksApi";

/*
|--------------------------------------------------------------------------
| Hook detalle libro
|--------------------------------------------------------------------------
*/

export function useBookDetail(bookId) {
  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  const [book, setBook] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Effect
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!bookId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);

      setError(null);

      try {
        /*
        |--------------------------------------------------------------------------
        | Libro
        |--------------------------------------------------------------------------
        */

        const bookData = await getBookById(bookId);

        /*
        |--------------------------------------------------------------------------
        | Reviews
        |--------------------------------------------------------------------------
        */

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
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  /*
  |--------------------------------------------------------------------------
  | Return
  |--------------------------------------------------------------------------
  */

  return {
    book,
    reviews,
    loading,
    error,
  };
}
