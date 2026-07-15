import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { getClients } from "../../services/clientService.js";
import { getMotorcycles } from "../../services/motorcycleService.js";
import { createSale } from "../../services/saleService.js";

const plans = [12, 15, 18, 24, 36];

const toInputDate = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const addMonth = (dateValue) => {
  const date = new Date(`${dateValue}T12:00:00`);
  date.setMonth(date.getMonth() + 1);
  return toInputDate(date);
};

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2
});

function SaleFormModal({ soldMotorcycleIds, onClose, onSaved }) {
  const today = toInputDate(new Date());
  const [form, setForm] = useState({
    clientId: "",
    motorcycleId: "",
    salePrice: "",
    downPayment: "",
    installmentPlan: "12",
    saleDate: today,
    firstDueDate: addMonth(today)
  });
  const [clients, setClients] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [clientList, motorcycleList] = await Promise.all([
          getClients(),
          getMotorcycles()
        ]);
        setClients(clientList);
        setMotorcycles(motorcycleList.filter((item) => !soldMotorcycleIds.has(item.id)));
      } catch (requestError) {
        setError(getApiError(requestError, "No se pudieron cargar clientes y motos"));
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [soldMotorcycleIds]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const calculation = useMemo(() => {
    const price = Number(form.salePrice) || 0;
    const downPayment = Number(form.downPayment) || 0;
    const financed = Math.max(price - downPayment, 0);
    const installment = financed / Number(form.installmentPlan);
    return { financed, installment };
  }, [form.downPayment, form.installmentPlan, form.salePrice]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "saleDate") next.firstDueDate = addMonth(value);
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (Number(form.downPayment) >= Number(form.salePrice)) {
      setError("La entrega debe ser menor al precio para que exista un monto financiado");
      return;
    }

    setSaving(true);
    try {
      const sale = await createSale({
        clientId: Number(form.clientId),
        motorcycleId: Number(form.motorcycleId),
        salePrice: Number(form.salePrice),
        downPayment: Number(form.downPayment),
        installmentPlan: Number(form.installmentPlan),
        saleDate: form.saleDate,
        firstDueDate: form.firstDueDate
      });
      onSaved(sale);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo registrar la venta"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sale-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="sale-modal" role="dialog" aria-modal="true" aria-labelledby="sale-form-title">
        <header className="sale-modal-header">
          <div><h2 id="sale-form-title">Nueva venta</h2><p>La confirmacion generara automaticamente todas las cuotas.</p></div>
          <button className="sale-modal-close" type="button" onClick={onClose} disabled={saving} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="sale-modal-body">
            {error && <div className="sale-form-error" role="alert">{error}</div>}
            {loadingOptions ? (
              <div className="sale-options-loading"><span /><span /><span /></div>
            ) : (
              <>
                <div className="sale-form-section">
                  <h3>Operacion</h3>
                  <div className="sale-form-grid">
                    <label>
                      <span>Cliente *</span>
                      <select name="clientId" value={form.clientId} onChange={handleChange} required autoFocus>
                        <option value="">Seleccionar cliente</option>
                        {clients.map((client) => <option key={client.id} value={client.id}>{client.name} - DNI {client.dni}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Moto disponible *</span>
                      <select name="motorcycleId" value={form.motorcycleId} onChange={handleChange} required>
                        <option value="">Seleccionar moto</option>
                        {motorcycles.map((moto) => <option key={moto.id} value={moto.id}>{moto.brand} {moto.model}{moto.domain ? ` - ${moto.domain}` : ""}</option>)}
                      </select>
                      {!motorcycles.length && <small>No hay motos disponibles para vender.</small>}
                    </label>
                    <label>
                      <span>Fecha de venta *</span>
                      <input type="date" name="saleDate" value={form.saleDate} onChange={handleChange} required />
                    </label>
                    <label>
                      <span>Primer vencimiento *</span>
                      <input type="date" name="firstDueDate" value={form.firstDueDate} onChange={handleChange} min={form.saleDate} required />
                    </label>
                  </div>
                </div>

                <div className="sale-form-section">
                  <h3>Financiacion</h3>
                  <div className="sale-form-grid">
                    <label>
                      <span>Precio de venta *</span>
                      <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} min="0.01" step="0.01" placeholder="0,00" required />
                    </label>
                    <label>
                      <span>Entrega inicial *</span>
                      <input type="number" name="downPayment" value={form.downPayment} onChange={handleChange} min="0" step="0.01" placeholder="0,00" required />
                    </label>
                    <label className="sale-plan-field">
                      <span>Plan de cuotas *</span>
                      <div className="plan-options">
                        {plans.map((plan) => (
                          <button className={form.installmentPlan === String(plan) ? "is-selected" : ""} type="button" key={plan} onClick={() => setForm((current) => ({ ...current, installmentPlan: String(plan) }))}>{plan}</button>
                        ))}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="financing-preview">
                  <div><span>Monto financiado</span><strong>{money.format(calculation.financed)}</strong></div>
                  <div><span>{form.installmentPlan} cuotas aproximadas de</span><strong>{money.format(calculation.installment)}</strong></div>
                </div>
              </>
            )}
          </div>

          <footer className="sale-modal-actions">
            <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving || loadingOptions || !clients.length || !motorcycles.length}>
              <FiCheck />{saving ? "Registrando..." : "Confirmar venta"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default SaleFormModal;
