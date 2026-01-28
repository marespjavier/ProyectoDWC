import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useCreateReview } from "../hooks/useCreateReview";

export function ReviewPage() {
  const { id } = useParams();            // id del libro (string)
  const bookId = Number(id);             // lo guardamos como number para JSON
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
    else if (userTrim.length < 2) errors.user = "El nombre debe tener al menos 2 caracteres.";

    if (!Number.isFinite(ratingNum)) errors.rating = "La puntuación no es válida.";
    else if (ratingNum < 1 || ratingNum > 5) errors.rating = "La puntuación debe estar entre 1 y 5.";

    if (!textTrim) errors.text = "La reseña es obligatoria.";
    else if (textTrim.length < 20) errors.text = "La reseña debe tener al menos 20 caracteres.";

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
      createdAt: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
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
      <p>
        Para el libro con ID: <strong>{bookId}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>
            Nombre:
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>
          {fieldErrors.user && <p style={{ color: "crimson" }}>{fieldErrors.user}</p>}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Puntuación (1-5):
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ marginLeft: 8, width: 60 }}
            />
          </label>
          {fieldErrors.rating && <p style={{ color: "crimson" }}>{fieldErrors.rating}</p>}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Reseña:
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              style={{ display: "block", width: "100%", marginTop: 6 }}
            />
          </label>
          {fieldErrors.text && <p style={{ color: "crimson" }}>{fieldErrors.text}</p>}
        </div>

        {error && <p style={{ color: "crimson" }}>Error al guardar: {error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Guardar reseña"}
        </button>

        <span style={{ marginLeft: 12 }}>
          <Link to={`/book/${bookId}`}>Cancelar</Link>
        </span>
      </form>
    </div>
  );
}
