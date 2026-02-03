import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, updateBook } from "../api/booksApi";
import { BookForm } from "./BookForm";

/*
  Página para editar un libro existente.
  Reutiliza BookForm con valores iniciales.
*/
export function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleUpdate(updatedBook) {
    setSaving(true);
    try {
      await updateBook(id, updatedBook);
      navigate(`/book/${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Cargando libro…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!book) return <p>Libro no encontrado</p>;

  const initialValues = {
    title: book.title,
    authorsText: book.authors.join(", "),
    description: book.description,
    genresText: book.genres.join(", "),
    publishedYear: book.publishedYear,
    pages: book.pages,
    language: book.language,
  };

  return (
    <div>
      <h1>Editar libro</h1>
      <BookForm
        initialValues={initialValues}
        onAdd={handleUpdate}
        disabled={saving}
        submitText="Guardar cambios"
      />
    </div>
  );
}
