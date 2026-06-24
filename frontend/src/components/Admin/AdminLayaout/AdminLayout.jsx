import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import SideBar from "../SideBar/SideBar";
import "./AdminLayout.css";

function AdminLayout() {
  const { user } = useAuth();

  // Si no está logueado o no es admin, redirigir
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="admin-layout">
      <SideBar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
