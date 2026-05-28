import { useNavigate } from "react-router-dom";

import { UserForm } from "./UserForm";

import { createUser } from "../api/usersApi";

/*
|--------------------------------------------------------------------------
| Crear usuario
|--------------------------------------------------------------------------
*/

export function NewUserPage() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Crear
  |--------------------------------------------------------------------------
  */

  async function handleCreate(user) {
    await createUser(user);

    navigate("/users");
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>Nuevo usuario</h1>
      </div>

      <UserForm onSubmit={handleCreate} submitText="Crear usuario" />
    </div>
  );
}
