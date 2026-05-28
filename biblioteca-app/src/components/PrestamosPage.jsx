import { useEffect, useState } from "react";

import {
  getPrestamos,
  devolverPrestamo,
  deletePrestamo,
} from "../api/prestamosApi";

import { canManageBooks } from "../utils/auth";

import { Link } from "react-router-dom";

import { ConfirmModal } from "./ConfirmModal";

import { FiEye, FiTrash2, FiCheck } from "react-icons/fi";

export function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [prestamoToDelete, setPrestamoToDelete] = useState(null);

  const [prestamoToReturn, setPrestamoToReturn] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load
  |--------------------------------------------------------------------------
  */

  async function loadPrestamos() {
    try {
      const data = await getPrestamos();

      const prestamosArray = Array.isArray(data)
        ? data
        : data?.data
          ? [data.data]
          : [];

      setPrestamos(prestamosArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrestamos();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Devolver
  |--------------------------------------------------------------------------
  */

  async function handleDevolver() {
    if (!prestamoToReturn) return;

    try {
      await devolverPrestamo(prestamoToReturn.id);

      await loadPrestamos();

      setPrestamoToReturn(null);
    } catch (err) {
      alert(err.message);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Eliminar
  |--------------------------------------------------------------------------
  */

  async function handleDelete() {
    if (!prestamoToDelete) return;

    try {
      await deletePrestamo(prestamoToDelete.id);

      setPrestamos((prev) => prev.filter((p) => p.id !== prestamoToDelete.id));

      setPrestamoToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | States
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <Loader text="Cargando préstamos..." />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <div className="page-header modern-header">
        <h1>{canManageBooks() ? "Gestión préstamos" : "Mis préstamos"}</h1>

        {canManageBooks() && (
          <Link to="/prestamos/new" className="btn-primary">
            + Nuevo préstamo
          </Link>
        )}
      </div>

      {/* TABLA */}

      <div className="table-card">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Estado</th>

              <th>Libro</th>

              {canManageBooks() && <th>Usuario</th>}

              <th>Fecha préstamo</th>

              <th>Fecha devolución</th>

              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {prestamos.map((prestamo) => (
              <tr key={prestamo.id}>
                {/* ESTADO */}

                <td>
                  {prestamo.estado === "devuelto" && (
                    <span className="status-badge status-devuelto">
                      Devuelto
                    </span>
                  )}

                  {(prestamo.estado === "activo" ||
                    prestamo.estado === "prestado") && (
                    <span className="status-badge status-prestado">
                      Prestado
                    </span>
                  )}

                  {prestamo.estado === "retrasado" && (
                    <span className="status-badge status-retrasado">
                      Retrasado
                    </span>
                  )}
                </td>

                {/* LIBRO */}

                <td>
                  <strong>{prestamo.libro?.titulo || "Sin título"}</strong>
                </td>

                {/* USER */}

                {canManageBooks() && (
                  <td>
                    <div className="table-user">
                      <img
                        src={prestamo.user?.avatar_url}
                        alt={prestamo.user?.nombre}
                        className="table-avatar"
                      />

                      <span>{prestamo.user?.nombre || "—"}</span>
                    </div>
                  </td>
                )}

                {/* FECHA */}

                <td>{prestamo.fecha_prestamo}</td>

                {/* DEVOLUCIÓN */}

                <td>{prestamo.fecha_devolucion || "Pendiente"}</td>

                {/* ACCIONES */}

                <td>
                  <div className="table-actions">
                    {/* VER */}

                    <Link
                      to={`/libro/${prestamo.libro_id}`}
                      className="table-icon-btn"
                    >
                      <FiEye />
                    </Link>

                    {/* DEVOLVER */}

                    {canManageBooks() && prestamo.estado !== "devuelto" && (
                      <button
                        className="table-icon-btn success"
                        onClick={() => setPrestamoToReturn(prestamo)}
                      >
                        <FiCheck />
                      </button>
                    )}

                    {/* DELETE */}

                    {canManageBooks() && (
                      <button
                        className="table-icon-btn danger"
                        onClick={() => setPrestamoToDelete(prestamo)}
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DELETE */}

      <ConfirmModal
        open={!!prestamoToDelete}
        title="Eliminar préstamo"
        message={
          prestamoToDelete
            ? `¿Eliminar préstamo de "${prestamoToDelete.libro?.titulo}"?`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setPrestamoToDelete(null)}
      />

      {/* MODAL DEVOLVER */}

      <ConfirmModal
        open={!!prestamoToReturn}
        title="Devolver préstamo"
        message={
          prestamoToReturn
            ? `¿Marcar como devuelto "${prestamoToReturn.libro?.titulo}"?`
            : ""
        }
        onConfirm={handleDevolver}
        onCancel={() => setPrestamoToReturn(null)}
      />
    </div>
  );
}
