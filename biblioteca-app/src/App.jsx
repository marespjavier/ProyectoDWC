import { Routes, Route } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Páginas
|--------------------------------------------------------------------------
*/

import { HomePage } from "./components/HomePage";

import { LoginPage } from "./components/LoginPage.jsx";

import { ShelfPage } from "./components/ShelfPage";

import { BookDetailPage } from "./components/BookDetailPage";

import { NewBookPage } from "./components/NewBookPage";

import { EditBookPage } from "./components/EditBookPage";

import { ReviewPage } from "./components/ReviewPage";

import { PrestamosPage } from "./components/PrestamosPage.jsx";

import { NewPrestamoPage } from "./components/NewPrestamoPage.jsx";

import { NotFoundPage } from "./components/NotFoundPage";

import { DashboardPage } from "./components/DashboardPage.jsx";

import { ProfilePage } from "./components/ProfilePage.jsx";

import { UsersPage } from "./components/UsersPage.jsx";

import { EditUserPage } from "./components/EditUserPage.jsx";

import { NewUserPage } from "./components/NewUserPage.jsx";

/*
|--------------------------------------------------------------------------
| Sidebar/Footer
|--------------------------------------------------------------------------
*/

import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";

/*
|--------------------------------------------------------------------------
| Auth helpers
|--------------------------------------------------------------------------
*/

import { canManageBooks } from "./utils/auth";

/*
|--------------------------------------------------------------------------
| App
|--------------------------------------------------------------------------
*/

function App() {
  /*
  |--------------------------------------------------------------------------
  | Auth
  |--------------------------------------------------------------------------
  */

  const token = localStorage.getItem("token");

  return (
    <div className="app-layout">
      {/* SIDEBAR */}

      {token && <Sidebar />}

      {/* TOPBAR INVITADO */}

      {!token && (
        <header className="guest-header">
          <div className="guest-logo">
            <img src="/libcloud.png" alt="LibCloud" />

            <h1>LibCloud</h1>
          </div>

          <div>
            <a href="/login" className="guest-login-btn">
              Iniciar sesión
            </a>
          </div>
        </header>
      )}

      {/* CONTENIDO */}

      <main className="main-content">
        <Routes>
          {/* LOGIN */}

          <Route path="/login" element={<LoginPage />} />

          {/* HOME */}

          <Route path="/" element={<HomePage />} />

          {/* RUTAS PRIVADAS */}

          {token && (
            <>
              {/* LIBROS */}

              <Route path="/libro/new" element={<NewBookPage />} />

              <Route path="/libro/:id/edit" element={<EditBookPage />} />

              <Route path="/libro/:id" element={<BookDetailPage />} />

              <Route path="/libro/:id/review" element={<ReviewPage />} />

              {/* ESTANTERÍA */}

              <Route path="/shelf" element={<ShelfPage />} />

              {/* PERFIL */}

              <Route path="/perfil" element={<ProfilePage />} />

              {/* RUTAS ADMIN / BIBLIOTECARIO */}

              {canManageBooks() && (
                <>
                  {/* DASHBOARD */}

                  <Route path="/dashboard" element={<DashboardPage />} />

                  {/* LIBROS */}

                  <Route path="/libro/new" element={<NewBookPage />} />

                  <Route path="/libro/:id/edit" element={<EditBookPage />} />

                  <Route path="/libro/:id/review" element={<ReviewPage />} />

                  {/* USUARIOS */}

                  <Route path="/users" element={<UsersPage />} />

                  <Route path="/users/new" element={<NewUserPage />} />

                  <Route path="/users/:id/edit" element={<EditUserPage />} />

                  {/* PRÉSTAMOS */}

                  <Route path="/prestamos" element={<PrestamosPage />} />

                  <Route path="/prestamos/new" element={<NewPrestamoPage />} />
                </>
              )}
            </>
          )}

          {/* 404 */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* FOOTER */}

        <Footer />
      </main>
    </div>
  );
}

export default App;