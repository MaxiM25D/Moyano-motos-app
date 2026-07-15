import { useEffect, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { createMotorcycle, updateMotorcycle } from "../../services/motorcycleService.js";

const emptyForm = {
  brand: "",
  model: "",
  year: "",
  domain: "",
  chassisNumber: "",
  engineNumber: "",
  color: ""
};

function MotorcycleFormModal({ motorcycle, onClose, onSaved }) {
  const [form, setForm] = useState(() => motorcycle ? {
    brand: motorcycle.brand,
    model: motorcycle.model,
    year: motorcycle.year?.toString() || "",
    domain: motorcycle.domain || "",
    chassisNumber: motorcycle.chassisNumber || "",
    engineNumber: motorcycle.engineNumber || "",
    color: motorcycle.color || ""
  } : emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(motorcycle);

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
      Object.entries(form)
        .filter(([key, value]) => key !== "year" || value !== "" || isEditing)
        .map(([key, value]) => [
          key,
          key === "year" ? (value === "" ? null : Number(value)) : value.trim()
        ])
    );

    try {
      const savedMotorcycle = isEditing
        ? await updateMotorcycle(motorcycle.id, payload)
        : await createMotorcycle(payload);
      onSaved(savedMotorcycle, isEditing);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo guardar la moto"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="moto-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="moto-modal" role="dialog" aria-modal="true" aria-labelledby="motorcycle-form-title">
        <header className="moto-modal-header">
          <div>
            <h2 id="motorcycle-form-title">{isEditing ? "Editar moto" : "Nueva moto"}</h2>
            <p>{isEditing ? "Actualiza los datos de la unidad." : "Registra una unidad para su venta."}</p>
          </div>
          <button className="moto-modal-close" type="button" onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar">
            <FiX />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="moto-modal-body">
            {error && <div className="moto-form-error" role="alert">{error}</div>}

            <div className="moto-form-grid">
              <label>
                <span>Marca *</span>
                <input name="brand" value={form.brand} onChange={handleChange} minLength="2" maxLength="80" autoFocus required />
              </label>
              <label>
                <span>Modelo *</span>
                <input name="model" value={form.model} onChange={handleChange} minLength="1" maxLength="80" required />
              </label>
              <label>
                <span>Año</span>
                <input name="year" value={form.year} onChange={handleChange} type="number" min="1950" max="2100" placeholder="Ej. 2026" />
              </label>
              <label>
                <span>Color</span>
                <input name="color" value={form.color} onChange={handleChange} maxLength="50" />
              </label>
              <label>
                <span>Dominio</span>
                <input name="domain" value={form.domain} onChange={handleChange} maxLength="100" placeholder="Ej. A123BCD" />
              </label>
              <label>
                <span>Numero de motor</span>
                <input name="engineNumber" value={form.engineNumber} onChange={handleChange} maxLength="100" />
              </label>
              <label className="moto-full-field">
                <span>Numero de chasis</span>
                <input name="chassisNumber" value={form.chassisNumber} onChange={handleChange} maxLength="100" />
              </label>
            </div>
          </div>

          <footer className="moto-modal-actions">
            <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving}>
              <FiSave />
              {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Registrar moto"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default MotorcycleFormModal;
