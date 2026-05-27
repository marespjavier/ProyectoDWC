import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import { getDashboardStats } from "../api/dashboardApi"

import { FiBook, FiUsers, FiClock, FiArchive } from "react-icons/fi"

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
} from "recharts"

/*
|--------------------------------------------------------------------------
| Dashboard administración
|--------------------------------------------------------------------------
*/

export function DashboardPage() {
  const [stats, setStats] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  /*
  |--------------------------------------------------------------------------
  | Cargar estadísticas
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats()

        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <p>Cargando dashboard...</p>
  }

  if (error) {
    return <p className="error">{error}</p>
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
  ]

  const librosData = [
    {
      name: "Disponibles",
      value: stats.librosDisponibles,
    },

    {
      name: "Prestados",
      value: stats.totalLibros - stats.librosDisponibles,
    },
  ]

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

            <p>Gestionar usuarios</p>
          </article>
        </Link>
      </div>

      {/* CHARTS */}

      <div className="charts-grid">
        {/* PIE CHART */}

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

        {/* BAR CHART */}

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
      </div>
    </div>
  )
}
