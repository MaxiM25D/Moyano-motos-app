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
  const baseAmount = Number(installment.amount);
  const [form, setForm] = useState({
    method: "CASH",
    paidAt: toInputDate(new Date()),
    interestRate: "0",
    amount: baseAmount.toFixed(2),
    balanceAllocation: "NEXT_INSTALLMENT",
    notes: ""
  });
  const [amountManuallyEdited, setAmountManuallyEdited] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const interestRate = Number(form.interestRate || 0);
  const interestAmount = Math.round(baseAmount * interestRate) / 100;
  const totalAmount = Math.round((baseAmount + interestAmount) * 100) / 100;
  const receivedAmount = Number(form.amount) || 0;
  const carriedBalance = Math.max(
    Math.round((totalAmount - receivedAmount) * 100) / 100,
    0
  );
  const isPartialPayment = receivedAmount > 0 && carriedBalance > 0;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "amount") setAmountManuallyEdited(true);

    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "interestRate" && !amountManuallyEdited) {
        const nextInterest = Math.round(baseAmount * Number(value || 0)) / 100;
        next.amount = (baseAmount + nextInterest).toFixed(2);
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (receivedAmount <= 0 || receivedAmount > totalAmount) {
      setError("El importe recibido debe ser mayor a cero y no superar el total de la cuota");
      return;
    }

    setSaving(true);

    try {
      const paidInstallment = await payInstallment(installment.id, {
        method: form.method,
        paidAt: form.paidAt,
        interestRate,
        amount: receivedAmount,
        balanceAllocation: isPartialPayment ? form.balanceAllocation : undefined,
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
            <p>{installment.sale?.client?.name} - Cuota {installment.number}</p>
          </div>
          <button className="payment-close" type="button" onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="payment-modal-body">
            {error && <div className="payment-form-error" role="alert">{error}</div>}

            <div className="payment-amount-summary">
              <span>Total a cobrar</span>
              <strong>{money.format(totalAmount)}</strong>
              <div className="payment-interest-summary">
                <span>Cuota base <b>{money.format(baseAmount)}</b></span>
                <span>Interes ({interestRate}%) <b>{money.format(interestAmount)}</b></span>
              </div>
              {isPartialPayment && (
                <div className="payment-balance-summary">
                  <span>Importe recibido <b>{money.format(receivedAmount)}</b></span>
                  <span>Saldo a trasladar <b>{money.format(carriedBalance)}</b></span>
                </div>
              )}
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
              <label>
                <span>Interes aplicado (%)</span>
                <input type="number" name="interestRate" value={form.interestRate} onChange={handleChange} min="0" max="100" step="0.01" inputMode="decimal" />
              </label>
              <label>
                <span>Importe recibido *</span>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} min="0.01" max={totalAmount} step="0.01" inputMode="decimal" required />
              </label>
              {isPartialPayment && (
                <label className="payment-allocation-field">
                  <span>Trasladar saldo pendiente a *</span>
                  <select name="balanceAllocation" value={form.balanceAllocation} onChange={handleChange} required>
                    <option value="NEXT_INSTALLMENT">La proxima cuota</option>
                    <option value="REMAINING_INSTALLMENTS">Todas las cuotas restantes</option>
                  </select>
                </label>
              )}
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
