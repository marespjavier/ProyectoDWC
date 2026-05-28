import { useState } from "react";
import { createReview } from "../api/booksApi";

/*
  Hook para crear reseñas.
  Expone "saveReview" y estados (saving/error) para mostrar feedback en la UI.
*/

export function useCreateReview() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function saveReview(review) {
    setSaving(true);
    setError(null);

    try {
      const created = await createReview(review);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return null;
    } finally {
      setSaving(false);
    }
  }

  return { saving, error, saveReview };
}
