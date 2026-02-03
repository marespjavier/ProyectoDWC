import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useCreateReview } from "../hooks/useCreateReview";

export function ReviewPage() {
  const { id } = useParams(); // id del libro (string)
  const bookId = Number(id); // lo guardamos como number para JSON
  const navigate = useNavigate();

  const { saving, error, saveReview } = useCreateReview();

  const [user, setUser] = useState("");
  const [rating, setRating] = useState("5"); // lo guardo string y lo convierto al enviar
  const [text, setText] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errors = {};

    const userTrim = user.trim();
    const textTrim = text.trim();
    const ratingNum = Number(rating);

    if (!userTrim) errors.user = "El nombre es obligatorio.";
    else if (userTrim.length < 2)
      errors.user = "El nombre debe tener al menos 2 caracteres.";

    if (!Number.isFinite(ratingNum))
      errors.rating = "La puntuación no es válida.";
    else if (ratingNum < 1 || ratingNum > 5)
      errors.rating = "La puntuación debe estar entre 1 y 5.";

    if (!textTrim) errors.text = "La reseña es obligatoria.";
    else if (textTrim.length < 20)
      errors.text = "La reseña debe tener al menos 20 caracteres.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const review = {
      bookId,
      user: user.trim(),
      rating: Number(rating),
      text: text.trim(),
      createdAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    };

    const created = await saveReview(review);

    if (created) {
      // volver al detalle
      navigate(`/book/${bookId}`);
    }
  }

  return (
    <div>
      <h1>Nueva reseña</h1>

      <form className="form" onSubmit={handleSubmit}>
        {/* Error global de la API */}
        {error && <div className="form-error">Error al guardar: {error}</div>}

        {/* Error global de validación (si quisieras uno solo).
          En tu caso tienes errores por campo, así que no hace falta.
      */}

        <div className="form-row">
          <label>Nombre</label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            disabled={saving}
            placeholder="Tu nombre"
          />
          {fieldErrors.user && <div className="error">{fieldErrors.user}</div>}
        </div>

        <div className="form-row">
          <label>Puntuación (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            disabled={saving}
          />
          {fieldErrors.rating && (
            <div className="error">{fieldErrors.rating}</div>
          )}
        </div>

        <div className="form-row">
          <label>Reseña</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={saving}
            rows={5}
            placeholder="Escribe tu opinión..."
          />
          {fieldErrors.text && <div className="error">{fieldErrors.text}</div>}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar reseña"}
          </button>

          <Link className="btn-secondary" to={`/book/${bookId}`}>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
