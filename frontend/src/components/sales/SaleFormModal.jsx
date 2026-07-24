import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { getClients } from "../../services/clientService.js";
import { getMotorcycles } from "../../services/motorcycleService.js";
import { createSale } from "../../services/saleService.js";
import CurrencyInput from "../common/CurrencyInput.jsx";
import SearchableSelect from "../common/SearchableSelect.jsx";

const installmentOptions = Array.from({ length: 60 }, (_, index) => index + 1);

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
    financingInterestRate: "0",
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
    const interestRate = Number(form.financingInterestRate) || 0;
    const interest = financed * interestRate / 100;
    const totalFinanced = financed + interest;
    const installment = totalFinanced / Number(form.installmentPlan);
    return { financed, interest, totalFinanced, installment };
  }, [form.downPayment, form.financingInterestRate, form.installmentPlan, form.salePrice]);

  const clientOptions = useMemo(() => clients.map((client) => ({
    value: client.id,
    label: client.name,
    detail: `DNI ${client.dni}`,
    selectionLabel: `${client.name} - DNI ${client.dni}`,
    searchText: `${client.name} ${client.dni}`
  })), [clients]);

  const motorcycleOptions = useMemo(() => motorcycles.map((motorcycle) => ({
    value: motorcycle.id,
    label: `${motorcycle.brand} ${motorcycle.model}`,
    detail: motorcycle.domain || "Sin dominio",
    selectionLabel: `${motorcycle.brand} ${motorcycle.model}${motorcycle.domain ? ` - ${motorcycle.domain}` : ""}`,
    searchText: `${motorcycle.brand} ${motorcycle.model} ${motorcycle.domain || ""}`
  })), [motorcycles]);

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
        financingInterestRate: Number(form.financingInterestRate),
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
                    <div className="sale-form-field">
                      <span>Cliente *</span>
                      <SearchableSelect
                        name="clientId"
                        value={form.clientId}
                        options={clientOptions}
                        onValueChange={(value) => setForm((current) => ({ ...current, clientId: value }))}
                        ariaLabel="Buscar y seleccionar cliente"
                        placeholder="Buscar por nombre o DNI"
                        emptyMessage="No encontramos clientes"
                        required
                      />
                    </div>
                    <div className="sale-form-field">
                      <span>Moto disponible *</span>
                      <SearchableSelect
                        name="motorcycleId"
                        value={form.motorcycleId}
                        options={motorcycleOptions}
                        onValueChange={(value) => setForm((current) => ({ ...current, motorcycleId: value }))}
                        ariaLabel="Buscar y seleccionar moto disponible"
                        placeholder="Buscar marca, modelo o dominio"
                        emptyMessage={motorcycles.length ? "No encontramos motos" : "No hay motos disponibles"}
                        required
                      />
                      {!motorcycles.length && <small>No hay motos disponibles para vender.</small>}
                    </div>
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
                      <CurrencyInput name="salePrice" value={form.salePrice} onValueChange={(value) => setForm((current) => ({ ...current, salePrice: value }))} min="0.01" placeholder="0,00" required />
                    </label>
                    <label>
                      <span>Entrega inicial *</span>
                      <CurrencyInput name="downPayment" value={form.downPayment} onValueChange={(value) => setForm((current) => ({ ...current, downPayment: value }))} min="0" placeholder="0,00" required />
                    </label>
                    <label>
                      <span>Cantidad de cuotas *</span>
                      <select name="installmentPlan" value={form.installmentPlan} onChange={handleChange} required>
                        {installmentOptions.map((amount) => <option key={amount} value={amount}>{amount} {amount === 1 ? "cuota" : "cuotas"}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Interes de financiacion (%)</span>
                      <input type="number" name="financingInterestRate" value={form.financingInterestRate} onChange={handleChange} min="0" max="100" step="0.01" placeholder="0,00" />
                    </label>
                  </div>
                </div>

                <div className="financing-preview">
                  <div><span>Capital financiado</span><strong>{money.format(calculation.financed)}</strong></div>
                  <div><span>Interes agregado ({Number(form.financingInterestRate) || 0}%)</span><strong>{money.format(calculation.interest)}</strong></div>
                  <div className="financing-total"><span>Total con interes</span><strong>{money.format(calculation.totalFinanced)}</strong></div>
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
