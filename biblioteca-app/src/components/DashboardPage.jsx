"use strict";

import { useEffect, useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

import { Link } from "react-router-dom";

import { getDashboardStats } from "../api/dashboardApi";

import {
  FiBook,
  FiUsers,
  FiClock,
  FiArchive,
  FiStar,
  FiMessageSquare,
  FiAward,
} from "react-icons/fi";

import { Loader } from "./Loader";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/*
|--------------------------------------------------------------------------
| Dashboard administración
|--------------------------------------------------------------------------
*/

export function DashboardPage() {

  useDocumentTitle("LibCloud - Panel administración");
  
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Cargar estadísticas
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();

        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <Loader text="Cargando dashboard..." />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  /*
  |--------------------------------------------------------------------------
  | Datos gráficos
  |--------------------------------------------------------------------------
  */

  const prestamosData = [
    {
      name: "Prestados",
      value: stats.prestamosActivos,
    },

    {
      name: "Retrasados",
      value: stats.prestamosRetrasados,
    },

    {
      name: "Devueltos",
      value:
        stats.totalPrestamos -
        stats.prestamosActivos -
        stats.prestamosRetrasados,
    },
  ];

  const librosData = [
    {
      name: "Disponibles",
      value: stats.librosDisponibles,
    },

    {
      name: "Prestados",
      value: stats.totalLibros - stats.librosDisponibles,
    },
  ];

  const reviewsData = [
    {
      name: "Media",
      value: stats.ratingMedia,
    },
  ];

  return (
    <div>
      <div className="page-header modern-header">
        <h1>Panel administración</h1>
      </div>

      {/* STATS */}

      <div className="dashboard-grid">
        {/* LIBROS */}

        <article className="dashboard-card">
          <div className="dashboard-icon">
            <FiBook />
          </div>

          <h2>{stats.totalLibros}</h2>

          <p>Libros registrados</p>
        </article>

        {/* DISPONIBLES */}

        <article className="dashboard-card">
          <div className="dashboard-icon">
            <FiArchive />
          </div>

          <h2>{stats.librosDisponibles}</h2>

          <p>Disponibles</p>
        </article>

        {/* PRÉSTAMOS */}

        <Link to="/prestamos" className="dashboard-link">
          <article className="dashboard-card">
            <div className="dashboard-icon">
              <FiBook />
            </div>

            <h2>{stats.prestamosActivos}</h2>

            <p>Préstamos activos</p>
          </article>
        </Link>

        {/* RETRASADOS */}

        <Link to="/prestamos" className="dashboard-link">
          <article className="dashboard-card">
            <div className="dashboard-icon">
              <FiClock />
            </div>

            <h2>{stats.prestamosRetrasados}</h2>

            <p>Retrasados</p>
          </article>
        </Link>

        {/* USUARIOS */}

        <Link to="/users" className="dashboard-link">
          <article className="dashboard-card">
            <div className="dashboard-icon">
              <FiUsers />
            </div>

            <h2>{stats.usuarios}</h2>

            <p>Usuarios</p>
          </article>
        </Link>

        {/* RESEÑAS */}

        <article className="dashboard-card">
          <div className="dashboard-icon">
            <FiMessageSquare />
          </div>

          <h2>{stats.totalReviews}</h2>

          <p>Reseñas publicadas</p>
        </article>

        {/* VALORACIÓN MEDIA */}

        <article className="dashboard-card">
          <div className="dashboard-icon">
            <FiStar />
          </div>

          <h2>{stats.ratingMedia}</h2>

          <p>Valoración media</p>
        </article>

        {/* USUARIOS CON RESEÑAS */}

        <article className="dashboard-card">
          <div className="dashboard-icon">
            <FiUsers />
          </div>

          <h2>{stats.usuariosConReviews}</h2>

          <p>Usuarios que reseñan</p>
        </article>

        {/* LIBRO MEJOR VALORADO */}

        <article className="dashboard-card">
          <div className="dashboard-icon">
            <FiAward />
          </div>

          <h2>{stats.bestBook?.rating ?? "-"}</h2>

          <p>
            {stats.bestBook?.titulo ??
              "Todavía no existen suficientes datos para mostrar estadísticas."}
          </p>
        </article>
      </div>

      {/* CHARTS */}

      <div className="charts-grid">
        {/* ESTADO PRÉSTAMOS */}

        <div className="chart-card">
          <h2>Estado préstamos</h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={prestamosData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
              >
                <Cell fill="#2563eb" />
                <Cell fill="#dc2626" />
                <Cell fill="#16a34a" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ESTADO LIBROS */}

        <div className="chart-card">
          <h2>Estado libros</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={librosData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* VALORACIÓN MEDIA */}

        <div className="chart-card">
          <h2>Valoración media biblioteca</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={reviewsData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis domain={[0, 5]} />

              <Tooltip />

              <Bar dataKey="value" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="dashboard-ranking-grid">
        {/* TOP LIBROS */}

        <div className="ranking-card">
          <h2>
            <FiAward />
            Top libros valorados
          </h2>

          {stats.topBooks?.length > 0 ? (
            <ul className="ranking-list">
              {stats.topBooks.map((book, index) => (
                <li key={book.libro_id}>
                  <span>
                    #{index + 1} {book.libro?.titulo}
                  </span>

                  <strong>⭐ {Number(book.media).toFixed(1)}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              Todavía no existen suficientes datos para mostrar estadísticas.
            </p>
          )}
        </div>

        {/* TOP USUARIOS */}

        <div className="ranking-card">
          <h2>
            <FiUsers />
            Usuarios más activos
          </h2>

          {stats.topUsers?.length > 0 ? (
            <ul className="ranking-list">
              {stats.topUsers.map((user, index) => (
                <li key={user.user_id}>
                  <span>
                    #{index + 1} {user.user?.nombre}
                  </span>

                  <strong>{user.total_reviews} reseñas</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              Todavía no existen suficientes datos para mostrar estadísticas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
