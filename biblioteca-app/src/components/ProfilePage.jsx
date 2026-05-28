import { useEffect, useState } from "react";

import { getUser } from "../api/usersApi";

import { getPrestamos } from "../api/prestamosApi";

import { Loader } from "./Loader";

/*
|--------------------------------------------------------------------------
| Perfil usuario
|--------------------------------------------------------------------------
*/

export function ProfilePage() {
  /*
  |--------------------------------------------------------------------------
  | Usuario actual
  |--------------------------------------------------------------------------
  */

  const currentUser = JSON.parse(localStorage.getItem("user"));

  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  const [user, setUser] = useState(null);

  const [prestamos, setPrestamos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Cargar datos
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadData() {
      try {
        /*
        |--------------------------------------------------------------------------
        | Usuario
        |--------------------------------------------------------------------------
        */

        const userData = await getUser(currentUser.id);

        setUser(userData);

        /*
        |--------------------------------------------------------------------------
        | Préstamos
        |--------------------------------------------------------------------------
        */

        const prestamosData = await getPrestamos();

        setPrestamos(prestamosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <Loader text="Cargando perfil..." />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  /*
  |--------------------------------------------------------------------------
  | Estadísticas
  |--------------------------------------------------------------------------
  */

  const activos = prestamos.filter((p) => p.estado === "activo").length;

  const retrasados = prestamos.filter((p) => p.estado === "retrasado").length;

  const historial = prestamos.length;

  return (
    <div className="profile-page">
      {/* HEADER */}

      <div className="page-header">
        <h1>Mi perfil</h1>
      </div>

      {/* DATOS */}

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

      {/* ACTIVIDAD */}

      <section className="profile-card">
        <h2>Actividad</h2>

        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h2>{activos}</h2>

            <p>Préstamos activos</p>
          </article>

          <article className="dashboard-card">
            <h2>{retrasados}</h2>

            <p>Retrasados</p>
          </article>

          <article className="dashboard-card">
            <h2>{historial}</h2>

            <p>Historial total</p>
          </article>
        </div>
      </section>

      {/* ÚLTIMOS PRÉSTAMOS */}

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
    </div>
  );
}
