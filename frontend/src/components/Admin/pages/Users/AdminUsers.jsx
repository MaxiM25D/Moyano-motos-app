import { useEffect, useState } from "react";
import { getUsers } from "../../../../services/userService";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="admin-loading">Cargando usuarios...</p>;

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <h2>Usuarios</h2>
        <span className="users-count">{users.length} registrados</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.email ?? index}>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge ${user.role}`}>
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
