import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404</h1>

      <h2>Página no encontrada</h2>

      <p>
        La página que intentas visitar no existe o ha sido movida.
      </p>

      <Link to="/" className="btn-secondary">
        Volver al inicio
      </Link>
    </div>
  );
}