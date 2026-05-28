import { useEffect, useState } from "react";

import { getUsers, deleteUser } from "../api/usersApi";

import { Link } from "react-router-dom";

import { ConfirmModal } from "./ConfirmModal";

import { FiEdit2, FiTrash2 } from "react-icons/fi";

/*
|--------------------------------------------------------------------------
| Gestión usuarios
|--------------------------------------------------------------------------
*/

export function UsersPage() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Cargar usuarios
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Eliminar
  |--------------------------------------------------------------------------
  */

  async function handleDelete() {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);

      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));

      setUserToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <Loader text="Cargando usuarios..." />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <div className="page-header modern-header">
        <h1>Gestión usuarios</h1>

        <Link to="/users/new" className="btn-primary">
          + Nuevo usuario
        </Link>
      </div>

      {/* TABLA */}

      <div className="table-card">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Usuario</th>

              <th>Email</th>

              <th>Teléfono</th>

              <th>Dirección</th>

              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {/* USER */}

                <td>
                  <div className="table-user">
                    <img
                      src={user.avatar_url}
                      alt={user.nombre}
                      className="table-avatar"
                    />

                    <span>{user.nombre}</span>
                  </div>
                </td>

                {/* EMAIL */}

                <td>{user.email}</td>

                {/* TEL */}

                <td>{user.telefono}</td>

                {/* DIRECCIÓN */}

                <td>{user.direccion}</td>

                {/* ACTIONS */}

                <td>
                  <div className="table-actions">
                    <Link
                      to={`/users/${user.id}/edit`}
                      className="table-icon-btn"
                    >
                      <FiEdit2 />
                    </Link>

                    <button
                      className="table-icon-btn danger"
                      onClick={() => setUserToDelete(user)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      <ConfirmModal
        open={!!userToDelete}
        title="Eliminar usuario"
        message={
          userToDelete
            ? `¿Seguro que quieres eliminar a "${userToDelete.nombre}"?`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}
