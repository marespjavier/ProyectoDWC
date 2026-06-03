import { useEffect, useState } from "react";

import { getUser } from "../api/usersApi";
import { getPrestamos } from "../api/prestamosApi";
import { getReviews } from "../api/reviewsApi";

import { Loader } from "./Loader";
import { ShelfPage } from "./ShelfPage";

import {
  FiUser,
  FiBook,
  FiBookOpen,
  FiClock,
  FiStar,
  FiCalendar,
} from "react-icons/fi";

/*
|--------------------------------------------------------------------------
| Perfil usuario
|--------------------------------------------------------------------------
*/

export function ProfilePage() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);

  const [prestamos, setPrestamos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("datos");

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getUser(currentUser.id);

        setUser(userData);

        const prestamosData = await getPrestamos();

        setPrestamos(prestamosData);
        const allReviews = await getReviews();

        const reviewsData = Array.isArray(allReviews)
          ? allReviews
          : (allReviews.data ?? []);

        const myReviews = reviewsData.filter(
          (review) => review.user?.id === currentUser?.id,
        );

        setReviews(myReviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <Loader text="Cargando perfil..." />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  const activos = prestamos.filter((p) => p.estado === "activo").length;

  const retrasados = prestamos.filter((p) => p.estado === "retrasado").length;

  const historial = prestamos.length;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Área personal</h1>
      </div>

      {/* TABS */}

      <div className="profile-tabs">
        <button
          className={activeTab === "datos" ? "active" : ""}
          onClick={() => setActiveTab("datos")}
        >
          <FiUser />

          <span>Datos personales</span>
        </button>

        <button
          className={activeTab === "shelf" ? "active" : ""}
          onClick={() => setActiveTab("shelf")}
        >
          <FiBook />

          <span>Mi estantería</span>
        </button>

        <button
          className={activeTab === "prestamos" ? "active" : ""}
          onClick={() => setActiveTab("prestamos")}
        >
          <FiBookOpen />

          <span>Últimos préstamos</span>
        </button>

        <button
          className={activeTab === "historial" ? "active" : ""}
          onClick={() => setActiveTab("historial")}
        >
          <FiClock />

          <span>Historial préstamos</span>
        </button>

        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          <FiStar />

          <span>Mis reseñas</span>
        </button>
      </div>

      {/* DATOS */}

      {activeTab === "datos" && (
        <section className="profile-card">
          <h2>Datos personales</h2>

          <div className="profile-grid">
            <div>
              <small>Nombre</small>

              <p>{user.nombre}</p>
            </div>

            <div>
              <small>Email</small>

              <p>{user.email}</p>
            </div>

            <div>
              <small>Teléfono</small>

              <p>{user.telefono}</p>
            </div>

            <div>
              <small>Dirección</small>

              <p>{user.direccion}</p>
            </div>
          </div>
        </section>
      )}

      {/* ESTANTERÍA */}

      {activeTab === "shelf" && (
        <section className="profile-card">
          <ShelfPage embedded />
        </section>
      )}

      {/* ÚLTIMOS PRÉSTAMOS */}

      {activeTab === "prestamos" && (
        <section className="profile-card">
          <h2>Últimos préstamos</h2>

          <div className="books-grid">
            {prestamos.slice(0, 3).map((prestamo) => (
              <article key={prestamo.id} className="book-card">
                <span
                  className={`
                      status-badge
                      status-${prestamo.estado}
                    `}
                >
                  {prestamo.estado}
                </span>

                <h3>{prestamo.libro?.titulo}</h3>

                <p>Prestado el {prestamo.fecha_prestamo}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* HISTORIAL */}

      {activeTab === "historial" && (
        <section className="profile-card">
          <h2>Historial de préstamos</h2>

          <p className="history-description">
            Consulta todos los libros que has tomado prestados.
          </p>

          <div className="history-stats">
            <article className="history-stat-card blue">
              <div className="history-stat-icon">
                <FiBookOpen />
              </div>

              <div>
                <h3>{activos}</h3>
                <p>Préstamos activos</p>
              </div>
            </article>

            <article className="history-stat-card orange">
              <div className="history-stat-icon">
                <FiClock />
              </div>

              <div>
                <h3>{retrasados}</h3>
                <p>Retrasados</p>
              </div>
            </article>

            <article className="history-stat-card green">
              <div className="history-stat-icon">
                <FiCalendar />
              </div>

              <div>
                <h3>{historial}</h3>
                <p>Historial total</p>
              </div>
            </article>
          </div>

          <div className="table-card">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Fecha préstamo</th>
                  <th>Fecha devolución</th>
                  <th>Estado</th>
                  <th>Días</th>
                </tr>
              </thead>

              <tbody>
                {[...prestamos]
                  .sort(
                    (a, b) =>
                      new Date(b.fecha_prestamo) - new Date(a.fecha_prestamo),
                  )
                  .map((prestamo) => {
                    const dias = prestamo.fecha_devolucion
                      ? Math.ceil(
                          (new Date(prestamo.fecha_devolucion) -
                            new Date(prestamo.fecha_prestamo)) /
                            (1000 * 60 * 60 * 24),
                        )
                      : "-";

                    return (
                      <tr key={prestamo.id}>
                        <td>
                          <div className="history-book">
                            <img
                              src={prestamo.libro?.imagen_url}
                              alt={prestamo.libro?.titulo}
                              className="history-book-cover"
                            />

                            <div>
                              <strong>{prestamo.libro?.titulo}</strong>

                              <p>ISBN: {prestamo.libro?.isbn}</p>
                            </div>
                          </div>
                        </td>

                        <td>{prestamo.fecha_prestamo}</td>

                        <td>{prestamo.fecha_devolucion || "Pendiente"}</td>

                        <td>
                          <span
                            className={`
                    status-badge
                    status-${prestamo.estado}
                  `}
                          >
                            {prestamo.estado}
                          </span>
                        </td>

                        <td>
                          <span className="history-days">{dias} días</span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {/* MIS RESEÑAS */}

      {activeTab === "reviews" && (
        <section className="profile-card">
          <h2>Mis reseñas</h2>

          {reviews.length === 0 ? (
            <p>Todavía no has publicado ninguna reseña.</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <article key={review.id} className="review-card">
                  <div className="review-book-header">
                    <img
                      src={
                        review.libro?.imagen_url ||
                        "https://via.placeholder.com/80x120"
                      }
                      alt={review.libro?.titulo}
                      className="review-book-cover"
                    />

                    <div>
                      <h3>{review.libro?.titulo}</h3>

                      <p className="review-book-author">
                        ISBN: {review.libro?.isbn}
                      </p>

                      <div className="review-rating">
                        {"⭐".repeat(review.rating)}
                      </div>

                      <small>
                        Publicada el{" "}
                        {new Date(review.created_at).toLocaleDateString(
                          "es-ES",
                        )}
                      </small>
                    </div>
                  </div>

                  <p className="review-text">{review.comentario}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
