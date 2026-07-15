import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { payInstallment } from "../../services/installmentService.js";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS"
});

const toInputDate = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const paymentMethods = [
  { value: "CASH", label: "Efectivo" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "CARD", label: "Tarjeta" },
  { value: "OTHER", label: "Otro" }
];

function PaymentModal({ installment, onClose, onPaid }) {
  const [form, setForm] = useState({
    method: "CASH",
    paidAt: toInputDate(new Date()),
    notes: ""
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const paidInstallment = await payInstallment(installment.id, {
        method: form.method,
        paidAt: form.paidAt,
        notes: form.notes.trim()
      });
      onPaid(paidInstallment);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo registrar el pago"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="payment-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
        <header className="payment-modal-header">
          <div>
            <h2 id="payment-title">Registrar pago</h2>
            <p>{installment.sale?.client?.name} · Cuota {installment.number}</p>
          </div>
          <button className="payment-close" type="button" onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="payment-modal-body">
            {error && <div className="payment-form-error" role="alert">{error}</div>}

            <div className="payment-amount-summary">
              <span>Importe de la cuota</span>
              <strong>{money.format(Number(installment.amount))}</strong>
              <small>Vence el {new Intl.DateTimeFormat("es-AR").format(new Date(installment.dueDate))}</small>
            </div>

            <div className="payment-form-grid">
              <label>
                <span>Medio de pago *</span>
                <select name="method" value={form.method} onChange={handleChange} required>
                  {paymentMethods.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
                </select>
              </label>
              <label>
                <span>Fecha de pago *</span>
                <input type="date" name="paidAt" value={form.paidAt} onChange={handleChange} required />
              </label>
              <label className="payment-notes-field">
                <span>Observaciones</span>
                <textarea name="notes" value={form.notes} onChange={handleChange} maxLength="500" rows="4" placeholder="Referencia de transferencia u otra aclaracion" />
              </label>
            </div>
          </div>

          <footer className="payment-modal-actions">
            <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving}><FiCheck />{saving ? "Registrando..." : "Confirmar pago"}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default PaymentModal;
