import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiGrid,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

import { canManageBooks } from "../utils/auth";

export function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (
        window.innerWidth <= 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest(".mobile-menu-btn")
      ) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMobileMenu = () => {
    if (window.innerWidth <= 1024) {
      setMobileMenuOpen(false);
    }
  };

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <>
      {mobileMenuOpen && window.innerWidth <= 1024 && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {!mobileMenuOpen && (
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <FiMenu />
        </button>
      )}

      <aside
        ref={sidebarRef}
        className={`sidebar ${mobileMenuOpen ? "open" : ""}`}
      >
        <div className="sidebar-logo">
          <img src="/libcloud.png" alt="LibCloud" height={50} width={32} />
          <h2>LibCloud</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiHome />
            <span>Inicio</span>
          </NavLink>

          <NavLink
            to="/perfil"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiUser />
            <span>Mi cuenta</span>
          </NavLink>

          {canManageBooks() && (
            <>
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FiGrid />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/prestamos"
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FiClipboard />
                <span>Préstamos</span>
              </NavLink>

              <NavLink
                to="/users"
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FiUsers />
                <span>Usuarios</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <img
              src={user?.avatar_url}
              alt={user?.nombre}
              className="sidebar-avatar"
            />
            <div>
              <strong>{user?.nombre}</strong>
            </div>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <FiLogOut />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
