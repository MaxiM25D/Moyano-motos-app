import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";

function SideBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">LUNEK ADMIN</div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin/products"
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          Productos
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          Usuarios
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default SideBar;
