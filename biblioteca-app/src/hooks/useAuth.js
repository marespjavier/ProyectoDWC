"use strict";

import { useState } from "react";
import { loginRequest } from "../api/authApi.js";

export function useAuth() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  async function login(email, password) {
    const data = await loginRequest(email, password);

    //Guardamos el token
    localStorage.setItem("token", data.token);

    //Guardamos el usuario
    localStorage.setItem("user", JSON.stringify(data.user));

    //Actualizamos el estado
    setUser(data.user);

    return data.user;
  }

  //Función de logout
  function logout() {
    //Eliminamos el token y el usuario del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    //Actualizamos el estado
    setUser(null);
  }

  return { user, login, logout, isAuthenticated: !!user };
}
