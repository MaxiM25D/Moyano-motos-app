import { useEffect, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { createClient, updateClient } from "../../services/clientService.js";

const emptyForm = {
  name: "",
  dni: "",
  phone: "",
  address: "",
  notes: ""
};

function ClientFormModal({ client, onClose, onSaved }) {
  const [form, setForm] = useState(() => client ? {
    name: client.name,
    dni: client.dni,
    phone: client.phone,
    address: client.address || "",
    notes: client.notes || ""
  } : emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(client);

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
    setError("");
    setSaving(true);

    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()])
    );

    try {
      const savedClient = isEditing
        ? await updateClient(client.id, payload)
        : await createClient(payload);
      onSaved(savedClient, isEditing);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo guardar el cliente"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="client-modal" role="dialog" aria-modal="true" aria-labelledby="client-form-title">
        <header className="modal-header">
          <div>
            <h2 id="client-form-title">{isEditing ? "Editar cliente" : "Nuevo cliente"}</h2>
            <p>{isEditing ? "Actualiza los datos registrados." : "Completa los datos del titular."}</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar">
            <FiX />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="client-form-error" role="alert">{error}</div>}

            <div className="form-grid">
              <label className="full-field">
                <span>Nombre y apellido *</span>
                <input name="name" value={form.name} onChange={handleChange} minLength="2" maxLength="100" autoFocus required />
              </label>
              <label>
                <span>DNI *</span>
                <input name="dni" value={form.dni} onChange={handleChange} inputMode="numeric" pattern="[0-9]{7,11}" maxLength="11" placeholder="Solo numeros" required />
              </label>
              <label>
                <span>Telefono *</span>
                <input name="phone" value={form.phone} onChange={handleChange} minLength="6" maxLength="30" inputMode="tel" required />
              </label>
              <label className="full-field">
                <span>Direccion</span>
                <input name="address" value={form.address} onChange={handleChange} maxLength="150" />
              </label>
              <label className="full-field">
                <span>Notas</span>
                <textarea name="notes" value={form.notes} onChange={handleChange} maxLength="500" rows="4" />
              </label>
            </div>
          </div>

          <footer className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving}>
              <FiSave />
              {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear cliente"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default ClientFormModal;
