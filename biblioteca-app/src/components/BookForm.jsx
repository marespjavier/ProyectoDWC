import { useState } from "react";

/*
  Formulario reutilizable para crear o editar libros.
  No conoce la API: solo valida y devuelve el objeto libro.
*/
export function BookForm({ onAdd, disabled, initialValues, submitText }) {
  // Estados inicializados desde initialValues (si existen)
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [authors, setAuthors] = useState(initialValues?.authorsText ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [genres, setGenres] = useState(initialValues?.genresText ?? "");
  const [publishedYear, setPublishedYear] = useState(
    initialValues?.publishedYear ? String(initialValues.publishedYear) : ""
  );
  const [pages, setPages] = useState(
    initialValues?.pages ? String(initialValues.pages) : ""
  );
  const [language, setLanguage] = useState(initialValues?.language ?? "");

  const [formError, setFormError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    const t = title.trim();
    const a = authors.trim();
    const d = description.trim();
    const g = genres.trim();
    const l = language.trim();

    // Validaciones
    if (!t) return setFormError("El título es obligatorio.");
    if (!a) return setFormError("Debes indicar al menos un autor.");
    if (!d) return setFormError("La descripción es obligatoria.");
    if (!g) return setFormError("Debes indicar al menos un género.");
    if (!l) return setFormError("El idioma es obligatorio.");

    if (t.length < 4) return setFormError("El título debe tener al menos 4 caracteres.");
    if (d.length < 8) return setFormError("La descripción debe tener al menos 8 caracteres.");
    if (l.length < 2) return setFormError("El idioma debe tener al menos 2 caracteres.");

    if (!pages.trim()) return setFormError("El número de páginas es obligatorio.");

    const pagesNum = Number(pages);
    if (Number.isNaN(pagesNum)) return setFormError("Las páginas deben ser un número.");
    if (pagesNum < 20) return setFormError("El libro debe tener al menos 20 páginas.");

    let yearValue = null;
    if (publishedYear.trim()) {
      const yearNum = Number(publishedYear);
      if (Number.isNaN(yearNum)) return setFormError("El año debe ser numérico.");
      yearValue = yearNum;
    }

    const authorsArr = a.split(",").map(x => x.trim()).filter(Boolean);
    const genresArr = g.split(",").map(x => x.trim()).filter(Boolean);

    const book = {
      title: t,
      authors: authorsArr,
      description: d,
      genres: genresArr,
      publishedYear: yearValue,
      pages: pagesNum,
      language: l,
      available: true,
    };

    try {
      await onAdd(book);
    } catch (err) {
      setFormError(err?.message ?? "No se ha podido guardar el libro.");
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{submitText ?? "Guardar libro"}</h2>

      {formError && <div className="form-error">{formError}</div>}

      <div className="form-row">
        <label>Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} disabled={disabled} />
      </div>

      <div className="form-row">
        <label>Autores (separados por comas)</label>
        <input value={authors} onChange={e => setAuthors(e.target.value)} disabled={disabled} />
      </div>

      <div className="form-row">
        <label>Descripción</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} disabled={disabled} />
      </div>

      <div className="form-row">
        <label>Géneros</label>
        <input value={genres} onChange={e => setGenres(e.target.value)} disabled={disabled} />
      </div>

      <div className="form-row">
        <label>Año de publicación</label>
        <input type="number" value={publishedYear} onChange={e => setPublishedYear(e.target.value)} disabled={disabled} />
      </div>

      <div className="form-row">
        <label>Páginas</label>
        <input type="number" value={pages} onChange={e => setPages(e.target.value)} disabled={disabled} />
      </div>

      <div className="form-row">
        <label>Idioma</label>
        <input value={language} onChange={e => setLanguage(e.target.value)} disabled={disabled} />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={disabled}>
          {submitText ?? "Guardar"}
        </button>
      </div>
    </form>
  );
}
