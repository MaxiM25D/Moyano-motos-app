import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiSave, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { createUser, updateUser } from "../../services/userService.js";

const roleOptions = [
  { value: "ADMIN", label: "Administrador" },
  { value: "SELLER", label: "Vendedor" },
  { value: "COLLECTOR", label: "Cobrador" }
];

function UserFormModal({ user, currentUserId, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "SELLER"
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEditing = Boolean(user);
  const isCurrentUser = user?.id === currentUserId;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role
    };
    if (form.password) payload.password = form.password;

    try {
      const savedUser = isEditing
        ? await updateUser(user.id, payload)
        : await createUser(payload);
      onSaved(savedUser, isEditing);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo guardar el usuario"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="user-modal" role="dialog" aria-modal="true" aria-labelledby="user-form-title">
        <header className="user-modal-header">
          <div><h2 id="user-form-title">{isEditing ? "Editar usuario" : "Nuevo usuario"}</h2><p>{isEditing ? "Actualiza el acceso y los datos de la cuenta." : "Crea una cuenta para el equipo de trabajo."}</p></div>
          <button onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="user-modal-body">
            {error && <div className="user-form-error" role="alert">{error}</div>}
            <div className="user-form-grid">
              <label className="user-full-field"><span>Nombre y apellido *</span><input name="name" value={form.name} onChange={handleChange} minLength="2" maxLength="100" autoFocus required /></label>
              <label className="user-full-field"><span>Email *</span><input name="email" type="email" value={form.email} onChange={handleChange} maxLength="150" autoComplete="off" required /></label>
              <label>
                <span>{isEditing ? "Nueva contraseña" : "Contraseña *"}</span>
                <div className="user-password-field">
                  <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} minLength="6" maxLength="100" autoComplete="new-password" required={!isEditing} placeholder={isEditing ? "Dejar vacio para conservar" : "Minimo 6 caracteres"} />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </div>
              </label>
              <label><span>Rol *</span><select name="role" value={form.role} onChange={handleChange} disabled={isCurrentUser}>{roleOptions.map((role) => <option value={role.value} key={role.value}>{role.label}</option>)}</select>{isCurrentUser && <small>Tu propio rol no se puede cambiar desde esta pantalla.</small>}</label>
            </div>
          </div>
          <footer className="user-modal-actions"><button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button><button className="primary-button" type="submit" disabled={saving}><FiSave />{saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear usuario"}</button></footer>
        </form>
      </section>
    </div>
  );
}

export default UserFormModal;
