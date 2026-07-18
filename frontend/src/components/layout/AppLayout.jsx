import { createElement, useState } from "react";
import {
  FiBarChart2,
  FiChevronDown,
  FiCreditCard,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPrinter,
  FiShoppingBag,
  FiUsers,
  FiUserCheck,
  FiX
} from "react-icons/fi";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import moyanoLogo from "../../assets/moyano-logo.png";
import "./AppLayout.css";

const navItems = [
  { to: "/", label: "Inicio", icon: FiHome },
  { to: "/clientes", label: "Clientes", icon: FiUsers },
  { to: "/motos", label: "Motos", icon: FiShoppingBag },
  { to: "/ventas", label: "Ventas", icon: FiFileText },
  { to: "/cuotas", label: "Cuotas", icon: FiCreditCard },
  { to: "/recibos", label: "Recibos", icon: FiPrinter },
  { to: "/reportes", label: "Reportes", icon: FiBarChart2, roles: ["ADMIN", "COLLECTOR"] },
  { to: "/usuarios", label: "Usuarios", icon: FiUserCheck, roles: ["ADMIN"] }
];

const roleLabels = {
  ADMIN: "Administrador",
  SELLER: "Vendedor",
  COLLECTOR: "Cobrador"
};

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <img src={moyanoLogo} alt="Moyano Motos" />
          <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menu">
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navegacion principal">
          <p className="nav-label">Gestion</p>
          {navItems.filter((item) => !item.roles || item.roles.includes(user.role)).map((item) =>
            item.disabled ? (
              <span className="nav-item is-disabled" key={item.to} aria-disabled="true">
                {createElement(item.icon)}
                {item.label}
              </span>
            ) : (
              <NavLink
                className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
                to={item.to}
                key={item.to}
                onClick={() => setSidebarOpen(false)}
              >
                {createElement(item.icon)}
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <p>Version 1.0</p>
          <p className="sidebar-credit">Desarrollado por <strong>InfinityDev</strong></p>
          <p className="sidebar-copyright">&copy; 2026 InfinityDev</p>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menu" />}

      <div className="app-main">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <FiMenu />
          </button>
          <div className="topbar-spacer" />
          <div className="user-menu-wrap">
            <button className="user-button" onClick={() => setUserMenuOpen((open) => !open)} aria-expanded={userMenuOpen}>
              <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="user-meta">
                <strong>{user.name}</strong>
                <small>{roleLabels[user.role] || user.role}</small>
              </span>
              <FiChevronDown />
            </button>
            {userMenuOpen && (
              <div className="user-dropdown">
                <button onClick={logout}><FiLogOut />Cerrar sesion</button>
              </div>
            )}
          </div>
        </header>

        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
