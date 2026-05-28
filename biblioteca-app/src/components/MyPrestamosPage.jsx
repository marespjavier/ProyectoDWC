import { useEffect, useState } from "react";
import { getPrestamos } from "../api/prestamosApi";

export function MyPrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  /*
    Cargar préstamos
  */

  useEffect(() => {
    async function load() {
      try {
        const data = await getPrestamos();

        setPrestamos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /*
    Loading
  */

  if (loading) {
    return <Loader text="Cargando préstamos..." />;
  }

  /*
    Error
  */

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <h1>Mis préstamos</h1>

      {prestamos.length === 0 ? (
        <div className="card">
          <p>No tienes préstamos registrados.</p>
        </div>
      ) : (
        <div className="books-grid">
          {prestamos.map((prestamo) => (
            <article key={prestamo.id} className="book-card">
              {/* BADGE ESTADO */}

              <div className="prestamo-status">
                {prestamo.estado === "devuelto" && (
                  <span className="status-badge status-devuelto">Devuelto</span>
                )}

                {prestamo.estado === "activo" && (
                  <span className="status-badge status-prestado">Activo</span>
                )}

                {prestamo.estado === "retrasado" && (
                  <span className="status-badge status-retrasado">
                    Retrasado
                  </span>
                )}
              </div>

              {/* LIBRO */}

              <h2>{prestamo.libro?.titulo || "Libro"}</h2>

              {/* MENSAJE ESTADO */}

              {prestamo.estado === "devuelto" && (
                <p className="status-text-ok">Libro devuelto correctamente</p>
              )}

              {prestamo.estado === "activo" && (
                <p className="pending-return">Actualmente prestado</p>
              )}

              {prestamo.estado === "retrasado" && (
                <p className="pending-return">Pendiente de devolución</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
