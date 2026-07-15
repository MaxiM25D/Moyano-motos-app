import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiShield, FiUserCheck, FiUsers, FiX } from "react-icons/fi";
import UserFormModal from "../../components/users/UserFormModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { getUsers, updateUser } from "../../services/userService.js";
import "./Users.css";

const roleLabels = { ADMIN: "Administrador", SELLER: "Vendedor", COLLECTOR: "Cobrador" };
const date = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await getUsers());
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar los usuarios"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => [user.name, user.email, roleLabels[user.role]].some((value) => value?.toLowerCase().includes(term)));
  }, [search, users]);

  const counts = useMemo(() => ({
    active: users.filter((user) => user.active).length,
    admins: users.filter((user) => user.role === "ADMIN" && user.active).length,
    team: users.filter((user) => user.role !== "ADMIN" && user.active).length
  }), [users]);

  const openCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleSaved = async (savedUser, wasEditing) => {
    setModalOpen(false);
    setSelectedUser(null);
    setNotice(wasEditing ? `${savedUser.name} fue actualizado.` : `${savedUser.name} fue creado.`);
    await loadUsers();
  };

  const toggleActive = async (user) => {
    if (user.id === currentUser.id) return;
    setUpdatingId(user.id);
    setError("");
    try {
      const updated = await updateUser(user.id, { active: !user.active });
      setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(`${updated.name} ahora esta ${updated.active ? "activo" : "inactivo"}.`);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo cambiar el estado"));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="users-page">
      <header className="users-header"><div><p>Administracion</p><h1>Usuarios</h1><span>Accesos y roles del equipo de trabajo.</span></div><button className="primary-button new-user-button" onClick={openCreate}><FiPlus />Nuevo usuario</button></header>

      {notice && <div className="users-success" role="status">{notice}</div>}
      {error && <div className="users-error" role="alert">{error}<button onClick={loadUsers}>Reintentar</button></div>}

      <div className="user-metrics">
        <article><span><FiUsers /></span><div><p>Usuarios activos</p><strong>{loading ? "--" : counts.active}</strong><small>{users.length} cuentas totales</small></div></article>
        <article><span className="admin-icon"><FiShield /></span><div><p>Administradores</p><strong>{loading ? "--" : counts.admins}</strong><small>Con acceso completo</small></div></article>
        <article><span className="team-icon"><FiUserCheck /></span><div><p>Equipo operativo</p><strong>{loading ? "--" : counts.team}</strong><small>Vendedores y cobradores</small></div></article>
      </div>

      <div className="users-toolbar"><div className="users-search"><FiSearch /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, email o rol" aria-label="Buscar usuarios" />{search && <button onClick={() => setSearch("")} aria-label="Limpiar busqueda" title="Limpiar busqueda"><FiX /></button>}</div><span>{loading ? "Cargando..." : `${visibleUsers.length} ${visibleUsers.length === 1 ? "usuario" : "usuarios"}`}</span></div>

      <div className="users-table-wrap">
        {loading ? <div className="users-loading"><span /><span /><span /><span /></div> : visibleUsers.length ? (
          <table className="users-table"><thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Registro</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>
            {visibleUsers.map((user) => <tr key={user.id} className={!user.active ? "inactive-row" : ""}>
              <td data-label="Usuario"><div className="user-identity"><span>{user.name.charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.id === currentUser.id ? "Tu cuenta" : `Usuario #${user.id}`}</small></div></div></td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Rol"><span className={`role-badge ${user.role.toLowerCase()}`}>{roleLabels[user.role]}</span></td>
              <td data-label="Registro">{date.format(new Date(user.createdAt))}</td>
              <td data-label="Estado"><label className={`user-status-toggle ${user.id === currentUser.id ? "is-locked" : ""}`} title={user.id === currentUser.id ? "No puedes desactivar tu propia cuenta" : user.active ? "Desactivar usuario" : "Activar usuario"}><input type="checkbox" checked={user.active} onChange={() => toggleActive(user)} disabled={user.id === currentUser.id || updatingId === user.id} /><span /><small>{updatingId === user.id ? "Guardando" : user.active ? "Activo" : "Inactivo"}</small></label></td>
              <td className="user-action-cell"><button onClick={() => openEdit(user)} aria-label={`Editar a ${user.name}`} title="Editar usuario"><FiEdit2 /></button></td>
            </tr>)}
          </tbody></table>
        ) : <div className="users-empty"><FiUsers /><strong>No encontramos usuarios</strong><span>Proba con otro nombre, email o rol.</span></div>}
      </div>

      {modalOpen && <UserFormModal user={selectedUser} currentUserId={currentUser.id} onClose={() => setModalOpen(false)} onSaved={handleSaved} />}
    </section>
  );
}

export default Users;
