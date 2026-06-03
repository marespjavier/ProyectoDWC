import { useState } from "react";

import { useNavigate, useParams, Link } from "react-router-dom";

import { useCreateReview } from "../hooks/useCreateReview";

/*
|--------------------------------------------------------------------------
| Página crear reseña
|--------------------------------------------------------------------------
*/

export function ReviewPage() {
  /*
  |--------------------------------------------------------------------------
  | Params
  |--------------------------------------------------------------------------
  */

  const { id } = useParams();

  const bookId = Number(id);

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Usuario actual
  |--------------------------------------------------------------------------
  */

  const currentUser = JSON.parse(localStorage.getItem("user"));

  /*
  |--------------------------------------------------------------------------
  | Hook crear reseña
  |--------------------------------------------------------------------------
  */

  const { saving, error, saveReview } = useCreateReview();

  /*
  |--------------------------------------------------------------------------
  | Estados formulario
  |--------------------------------------------------------------------------
  */

  const [rating, setRating] = useState("5");

  const [text, setText] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  /*
  |--------------------------------------------------------------------------
  | Validaciones
  |--------------------------------------------------------------------------
  */

  function validate() {
    const errors = {};

    const textTrim = text.trim();

    const ratingNum = Number(rating);

    /*
    |--------------------------------------------------------------------------
    | Rating
    |--------------------------------------------------------------------------
    */

    if (!Number.isFinite(ratingNum)) {
      errors.rating = "La puntuación no es válida.";
    } else if (ratingNum < 1 || ratingNum > 5) {
      errors.rating = "La puntuación debe estar entre 1 y 5.";
    }

    /*
    |--------------------------------------------------------------------------
    | Texto reseña
    |--------------------------------------------------------------------------
    */

    if (!textTrim) {
      errors.text = "La reseña es obligatoria.";
    } else if (textTrim.length < 20) {
      errors.text = "La reseña debe tener al menos 20 caracteres.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    /*
    |--------------------------------------------------------------------------
    | Review
    |--------------------------------------------------------------------------
    */

    const review = {
      libro_id: bookId,

      rating: Number(rating),

      comentario: text.trim(),
    };

    const created = await saveReview(review);

    /*
    |--------------------------------------------------------------------------
    | Redirección
    |--------------------------------------------------------------------------
    */

    if (created) {
      navigate(`/libro/${bookId}`);
    }
  }

  return (
    <div>
      <h1>Nueva reseña</h1>

      <form className="form" onSubmit={handleSubmit}>
        {/* ERROR */}

        {error && <div className="form-error">Error al guardar: {error}</div>}

        {/* USUARIO */}

        <div className="form-row">
          <label>Usuario</label>

          <input value={currentUser?.nombre ?? ""} disabled />
        </div>

        {/* RATING */}

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

        {/* TEXTO */}

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

        {/* ACTIONS */}

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar reseña"}
          </button>

          <Link className="btn-secondary" to={`/libro/${bookId}`}>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
