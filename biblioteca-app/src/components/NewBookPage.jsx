import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookForm } from "./BookForm";
import { createBook } from "../api/booksApi";

/*
  Página de creación de libro.
  Reutiliza <BookForm/> y envía los datos a la API con createBook().
*/

export function NewBookPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // Esta función la llamará BookForm cuando el formulario sea válido
  async function handleAdd(book) {
    setSaving(true);
    try {
      const created = await createBook(book);
      // Ir al detalle del libro creado
      navigate(`/book/${created.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <BookForm onAdd={handleAdd} disabled={saving} />
    </div>
  );
}
