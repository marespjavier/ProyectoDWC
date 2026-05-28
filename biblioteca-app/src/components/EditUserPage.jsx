import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getUser, updateUser } from "../api/usersApi";

import { Loader } from "./Loader";

/*
|--------------------------------------------------------------------------
| Editar usuario
|--------------------------------------------------------------------------
*/

export function EditUserPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Cargar usuario
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUser(id);

        setForm({
          nombre: data.nombre ?? "",

          email: data.email ?? "",

          telefono: data.telefono ?? "",

          direccion: data.direccion ?? "",

          password: "",
        });
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Inputs
  |--------------------------------------------------------------------------
  */

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      const payload = {
        ...form,
      };

      /*
      |--------------------------------------------------------------------------
      | Password vacía no se envía
      |--------------------------------------------------------------------------
      */

      if (!payload.password) {
        delete payload.password;
      }

      await updateUser(id, payload);

      navigate("/users");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loader text="Cargando usuario..." />;
  }

  return (
    <div className="form-page">
      <h1>Editar usuario</h1>

      <form className="card form-layout" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Teléfono
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
        </label>

        <label>
          Dirección
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
          />
        </label>

        <label>
          Nueva contraseña
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
