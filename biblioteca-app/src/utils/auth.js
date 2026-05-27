/*
  Helpers autenticación y roles
*/

/*
  Obtener usuario actual
*/
export function getUser() {
  const user = localStorage.getItem("user")

  return user ? JSON.parse(user) : null
}

/*
  Obtener token
*/
export function getToken() {
  return localStorage.getItem("token")
}

/*
  Comprobar autenticación
*/
export function isAuthenticated() {
  return !!getToken()
}

/*
  Comprobar rol Admin
*/
export function isAdmin() {
  const user = getUser()

  return user?.roles?.includes("Admin")
}

/*
  Comprobar rol Bibliotecario
*/
export function isBibliotecario() {
  const user = getUser()

  return user?.roles?.includes("Bibliotecario")
}

/*
  Comprobar rol Usuario
*/
export function isUsuario() {
  const user = getUser()

  return user?.roles?.includes("Usuario")
}

/*
  Roles gestión biblioteca
*/
export function canManageBooks() {
  return isAdmin() || isBibliotecario()
}
