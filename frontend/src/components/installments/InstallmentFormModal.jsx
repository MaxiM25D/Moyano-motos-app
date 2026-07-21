import { useEffect, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { updateInstallment } from "../../services/installmentService.js";

const toDateInput = (value) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

function InstallmentFormModal({ installment, onClose, onSaved }) {
  const [form, setForm] = useState({
    amount: String(installment.amount),
    dueDate: toDateInput(installment.dueDate)
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const savedInstallment = await updateInstallment(installment.id, {
        amount: Number(form.amount),
        dueDate: form.dueDate
      });
      onSaved(savedInstallment);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo actualizar la cuota"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="installment-form-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="installment-form-modal" role="dialog" aria-modal="true" aria-labelledby="installment-form-title">
        <header>
          <div>
            <h2 id="installment-form-title">Editar cuota {installment.number}</h2>
            <p>{installment.sale?.client?.name} · Venta #{installment.sale?.saleNumber || installment.saleId}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="installment-form-body">
            {error && <div className="installment-form-error" role="alert">{error}</div>}
            <div className="installment-form-grid">
              <label>
                <span>Importe *</span>
                <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} required autoFocus />
              </label>
              <label>
                <span>Vencimiento *</span>
                <input type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} required />
              </label>
            </div>
            <p className="installment-form-hint">Solo se modifica esta cuota. Las cuotas pagadas permanecen protegidas.</p>
          </div>

          <footer>
            <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving}><FiSave />{saving ? "Guardando..." : "Guardar cambios"}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default InstallmentFormModal;
