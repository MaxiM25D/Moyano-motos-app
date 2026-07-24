import { useEffect, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import {
  createInstallment,
  updateInstallment,
  updateInstallmentPlan
} from "../../services/installmentService.js";

const toDateInput = (value) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const addCalendarMonths = (value, months) => {
  const source = new Date(value);
  const targetMonthIndex = source.getUTCMonth() + Number(months);
  const targetYear = source.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const result = new Date(source);

  result.setUTCFullYear(targetYear, targetMonth, Math.min(source.getUTCDate(), lastDayOfTargetMonth));
  return result;
};

const getNextDueDate = (sale) => {
  const firstInstallment = sale.installments[0];
  const nextDate = firstInstallment
    ? addCalendarMonths(firstInstallment.dueDate, sale.installments.length)
    : addCalendarMonths(new Date(), 1);
  return toDateInput(nextDate);
};

function InstallmentFormModal({ installment = null, sale = null, editPlan = false, onClose, onSaved }) {
  const isCreating = !installment;
  const currentSale = sale || installment.sale;
  const latestInstallment = currentSale.installments?.at(-1);
  const [form, setForm] = useState({
    amount: String(installment?.amount || currentSale.installmentAmount || latestInstallment?.amount),
    dueDate: installment ? toDateInput(installment.dueDate) : getNextDueDate(currentSale)
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
      const installmentData = isCreating || editPlan
        ? { amount: Number(form.amount), dueDate: form.dueDate }
        : { dueDate: form.dueDate };
      const savedInstallment = isCreating
        ? await createInstallment(currentSale.id, installmentData)
        : editPlan
          ? await updateInstallmentPlan(installment.id, installmentData)
          : await updateInstallment(installment.id, installmentData);
      onSaved(savedInstallment);
    } catch (requestError) {
      setError(getApiError(requestError, isCreating ? "No se pudo agregar la cuota" : "No se pudo actualizar la cuota"));
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
            <h2 id="installment-form-title">
              {isCreating ? "Agregar cuota" : editPlan ? `Editar plan desde cuota ${installment.number}` : `Editar cuota ${installment.number}`}
            </h2>
            <p>{currentSale.client?.name} - Venta #{currentSale.saleNumber || currentSale.id}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="installment-form-body">
            {error && <div className="installment-form-error" role="alert">{error}</div>}
            <div className={`installment-form-grid${isCreating || editPlan ? "" : " single"}`}>
              {(isCreating || editPlan) && (
                <label>
                  <span>Importe *</span>
                  <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} required autoFocus />
                </label>
              )}
              <label>
                <span>Vencimiento *</span>
                <input type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} required autoFocus={!isCreating && !editPlan} />
              </label>
            </div>
            <p className="installment-form-hint">
              {isCreating
                ? `Se agregara como cuota ${currentSale.installments.length + 1} al final del plan.`
                : editPlan
                  ? "El nuevo importe y vencimiento se aplicaran a esta cuota y a todas las siguientes pendientes. El total del plan se recalculara y las cuotas pagadas permaneceran protegidas."
                  : "La nueva fecha se aplicara a esta cuota y reprogramara mensualmente todas las siguientes. Las cuotas pagadas permanecen protegidas."}
            </p>
          </div>

          <footer>
            <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving}>
              <FiSave />{saving ? "Guardando..." : isCreating ? "Agregar cuota" : editPlan ? "Actualizar plan" : "Guardar cambios"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default InstallmentFormModal;
