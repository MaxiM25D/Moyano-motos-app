import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { createRefinancing } from "../../services/refinancingService.js";
import "./Refinancing.css";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const installmentOptions = Array.from({ length: 60 }, (_, index) => index + 1);

const toDateInput = (value) => {
  const date = new Date(value);
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
};

function RefinancingFormModal({ sale, onClose, onSaved }) {
  const pendingInstallments = useMemo(
    () => sale.installments.filter((installment) => installment.status === "PENDING"),
    [sale.installments]
  );
  const firstPending = pendingInstallments[0];
  const [form, setForm] = useState({
    startInstallmentId: String(firstPending?.id || ""),
    interestRate: "0",
    installmentCount: String(pendingInstallments.length || 1),
    firstDueDate: firstPending ? toDateInput(firstPending.dueDate) : "",
    notes: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const calculation = useMemo(() => {
    const selected = pendingInstallments.find(
      (installment) => installment.id === Number(form.startInstallmentId)
    );
    const installmentsToReplace = selected
      ? pendingInstallments.filter((installment) => installment.number >= selected.number)
      : [];
    const previousBalance = installmentsToReplace.reduce(
      (total, installment) => total + Number(installment.amount),
      0
    );
    const interestAmount = previousBalance * (Number(form.interestRate) || 0) / 100;
    const totalAmount = previousBalance + interestAmount;
    const installmentAmount = totalAmount / Math.max(Number(form.installmentCount) || 1, 1);

    return { selected, installmentsToReplace, previousBalance, interestAmount, totalAmount, installmentAmount };
  }, [form.installmentCount, form.interestRate, form.startInstallmentId, pendingInstallments]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const handleStartChange = (event) => {
    const startInstallmentId = event.target.value;
    const selected = pendingInstallments.find(
      (installment) => installment.id === Number(startInstallmentId)
    );
    const remainingCount = selected
      ? pendingInstallments.filter((installment) => installment.number >= selected.number).length
      : 1;

    setForm((current) => ({
      ...current,
      startInstallmentId,
      installmentCount: String(remainingCount),
      firstDueDate: selected ? toDateInput(selected.dueDate) : current.firstDueDate
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const result = await createRefinancing(sale.id, {
        startInstallmentId: Number(form.startInstallmentId),
        interestRate: Number(form.interestRate),
        installmentCount: Number(form.installmentCount),
        firstDueDate: form.firstDueDate,
        notes: form.notes.trim()
      });
      onSaved(result);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo refinanciar el saldo"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="refinancing-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="refinancing-modal" role="dialog" aria-modal="true" aria-labelledby="refinancing-title">
        <header>
          <div>
            <h2 id="refinancing-title">Refinanciar saldo</h2>
            <p>{sale.client?.name} - Venta #{sale.saleNumber}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="refinancing-body">
            {error && <div className="refinancing-error" role="alert">{error}</div>}

            <div className="refinancing-form-grid">
              <label>
                <span>Refinanciar desde *</span>
                <select name="startInstallmentId" value={form.startInstallmentId} onChange={handleStartChange} required autoFocus>
                  {pendingInstallments.map((installment) => (
                    <option key={installment.id} value={installment.id}>
                      Cuota {installment.number} - {money.format(Number(installment.amount))}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Interes de refinanciacion (%) *</span>
                <input name="interestRate" type="number" min="0" max="100" step="0.01" value={form.interestRate} onChange={handleChange} required />
              </label>
              <label>
                <span>Nueva cantidad de cuotas *</span>
                <select name="installmentCount" value={form.installmentCount} onChange={handleChange} required>
                  {installmentOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>
                <span>Primer vencimiento *</span>
                <input name="firstDueDate" type="date" value={form.firstDueDate} onChange={handleChange} required />
              </label>
              <label className="refinancing-notes">
                <span>Observaciones</span>
                <textarea name="notes" value={form.notes} onChange={handleChange} maxLength="500" placeholder="Motivo o acuerdo realizado con el cliente" />
              </label>
            </div>

            <div className="refinancing-preview">
              <div><span>Saldo pendiente</span><strong>{money.format(calculation.previousBalance)}</strong></div>
              <div><span>Interes agregado</span><strong>{money.format(calculation.interestAmount)}</strong></div>
              <div className="refinancing-preview-total"><span>Nuevo total</span><strong>{money.format(calculation.totalAmount)}</strong></div>
              <div><span>Cuota estimada</span><strong>{money.format(calculation.installmentAmount)}</strong></div>
            </div>

            <p className="refinancing-warning">
              Se reemplazaran {calculation.installmentsToReplace.length} cuotas pendientes desde la cuota {calculation.selected?.number}. Los pagos y recibos anteriores no se modificaran.
            </p>
          </div>

          <footer>
            <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving || !pendingInstallments.length}>
              <FiRefreshCw />{saving ? "Refinanciando..." : "Confirmar refinanciacion"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default RefinancingFormModal;
