import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiCreditCard, FiDollarSign, FiEdit2, FiSearch, FiSliders, FiX } from "react-icons/fi";
import InstallmentFormModal from "../../components/installments/InstallmentFormModal.jsx";
import PaymentModal from "../../components/installments/PaymentModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { getInstallments } from "../../services/installmentService.js";
import "./Installments.css";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

const filters = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "UPCOMING", label: "Proximas" },
  { value: "OVERDUE", label: "Vencidas" },
  { value: "PAID", label: "Pagadas" }
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const startOfDay = (value) => {
  const result = new Date(value);
  result.setHours(0, 0, 0, 0);
  return result;
};

const daysUntilDue = (installment) => Math.round(
  (startOfDay(installment.dueDate) - startOfDay(new Date())) / DAY_IN_MS
);

const isOverdue = (installment) =>
  installment.status === "PENDING" && daysUntilDue(installment) < 0;

const isUpcoming = (installment) => {
  const days = daysUntilDue(installment);
  return installment.status === "PENDING" && days >= 0 && days <= 30;
};

const getUrgency = (installment) => {
  if (installment.status !== "PENDING") return { className: "", label: "" };

  const days = daysUntilDue(installment);
  if (days < 0) {
    const elapsed = Math.abs(days);
    return { className: "overdue", label: `Vencida hace ${elapsed} ${elapsed === 1 ? "dia" : "dias"}` };
  }
  if (days === 0) return { className: "today", label: "Vence hoy" };
  if (days === 1) return { className: "soon", label: "Vence mañana" };
  if (days <= 7) return { className: "soon", label: `Vence en ${days} dias` };
  if (days <= 30) return { className: "upcoming", label: `Vence en ${days} dias` };
  return { className: "", label: "" };
};

const priorityFor = (installment) => {
  if (installment.status === "PENDING") {
    const days = daysUntilDue(installment);
    if (days < 0) return 0;
    if (days <= 7) return 1;
    if (days <= 30) return 2;
    return 3;
  }
  if (installment.status === "PAID") return 4;
  return 5;
};

function Installments() {
  const { user } = useAuth();
  const [installments, setInstallments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("PRIORITY");
  const [search, setSearch] = useState("");
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [installmentToEdit, setInstallmentToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const canCollect = ["ADMIN", "COLLECTOR"].includes(user.role);
  const canManagePlan = user.role === "ADMIN";

  const loadInstallments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setInstallments(await getInstallments());
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar las cuotas"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInstallments();
  }, [loadInstallments]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const metrics = useMemo(() => {
    const pending = installments.filter((item) => item.status === "PENDING");
    const overdue = pending.filter(isOverdue);
    const paid = installments.filter((item) => item.status === "PAID");
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, item) => sum + Number(item.amount), 0),
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((sum, item) => sum + Number(item.amount), 0),
      paidCount: paid.length
    };
  }, [installments]);

  const filterCounts = useMemo(() => ({
    ALL: installments.length,
    PENDING: installments.filter((item) => item.status === "PENDING").length,
    UPCOMING: installments.filter(isUpcoming).length,
    OVERDUE: installments.filter(isOverdue).length,
    PAID: installments.filter((item) => item.status === "PAID").length
  }), [installments]);

  const visibleInstallments = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = installments.filter((item) => {
      const matchesFilter = filter === "ALL"
        || (filter === "UPCOMING" ? isUpcoming(item) : false)
        || (filter === "OVERDUE" ? isOverdue(item) : item.status === filter);
      const matchesSearch = !term || [
        item.sale?.client?.name,
        item.sale?.client?.dni,
        item.sale?.motorcycle?.brand,
        item.sale?.motorcycle?.model,
        item.sale?.motorcycle?.domain,
        item.sale?.saleNumber,
        item.saleId
      ].some((value) => String(value || "").toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });

    return filtered.sort((first, second) => {
      if (sortBy === "CLIENT") {
        return String(first.sale?.client?.name || "").localeCompare(
          String(second.sale?.client?.name || ""),
          "es"
        ) || new Date(first.dueDate) - new Date(second.dueDate);
      }
      if (sortBy === "AMOUNT_DESC") {
        return Number(second.amount) - Number(first.amount)
          || new Date(first.dueDate) - new Date(second.dueDate);
      }
      if (sortBy === "DUE_DATE") {
        return new Date(first.dueDate) - new Date(second.dueDate);
      }

      const priorityDifference = priorityFor(first) - priorityFor(second);
      if (priorityDifference !== 0) return priorityDifference;
      if (first.status === "PAID" && second.status === "PAID") {
        return new Date(second.paidAt || second.payment?.paidAt || 0)
          - new Date(first.paidAt || first.payment?.paidAt || 0);
      }
      return new Date(first.dueDate) - new Date(second.dueDate);
    });
  }, [filter, installments, search, sortBy]);

  const handlePaid = async (paidInstallment) => {
    setSelectedInstallment(null);
    setNotice(`El pago de la cuota ${paidInstallment.number} fue registrado correctamente.`);
    await loadInstallments();
  };

  const handleUpdated = async (updatedInstallment) => {
    setInstallmentToEdit(null);
    setNotice(`La cuota ${updatedInstallment.number} fue actualizada.`);
    await loadInstallments();
  };

  return (
    <section className="installments-page">
      <header className="installments-header">
        <div><p>Cobranzas</p><h1>Cuotas</h1><span>Seguimiento de vencimientos y pagos.</span></div>
      </header>

      {notice && <div className="installments-success" role="status">{notice}</div>}
      {error && <div className="installments-error" role="alert">{error}<button onClick={loadInstallments}>Reintentar</button></div>}

      <div className="installment-metrics">
        <article><span className="installment-metric-icon pending"><FiCreditCard /></span><div><p>Pendientes</p><strong>{loading ? "--" : metrics.pendingCount}</strong><small>{money.format(metrics.pendingAmount)}</small></div></article>
        <article className="overdue"><span className="installment-metric-icon overdue"><FiAlertCircle /></span><div><p>Vencidas</p><strong>{loading ? "--" : metrics.overdueCount}</strong><small>{money.format(metrics.overdueAmount)}</small></div></article>
        <article><span className="installment-metric-icon paid"><FiCheckCircle /></span><div><p>Pagadas</p><strong>{loading ? "--" : metrics.paidCount}</strong><small>Cuotas cobradas</small></div></article>
      </div>

      <div className="installments-controls">
        <div className="installment-filters" aria-label="Filtrar cuotas">
          {filters.map((item) => <button className={filter === item.value ? "is-active" : ""} key={item.value} onClick={() => setFilter(item.value)}><span>{item.label}</span><small>{filterCounts[item.value]}</small></button>)}
        </div>
        <div className="installments-control-right">
          <label className="installments-sort">
            <FiSliders />
            <span className="sr-only">Ordenar cuotas</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Ordenar cuotas">
              <option value="PRIORITY">Prioridad</option>
              <option value="DUE_DATE">Vencimiento</option>
              <option value="CLIENT">Cliente</option>
              <option value="AMOUNT_DESC">Mayor importe</option>
            </select>
          </label>
          <div className="installments-search"><FiSearch /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cliente, DNI, moto o venta" aria-label="Buscar cuotas" />{search && <button onClick={() => setSearch("")} aria-label="Limpiar busqueda" title="Limpiar busqueda"><FiX /></button>}</div>
        </div>
      </div>

      <div className="installments-table-wrap">
        {loading ? (
          <div className="installments-loading"><span /><span /><span /><span /></div>
        ) : visibleInstallments.length ? (
          <table className="installments-table">
            <thead><tr><th>Cliente</th><th>Moto</th><th>Cuota</th><th>Vencimiento</th><th>Importe</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {visibleInstallments.map((item) => {
                const overdue = isOverdue(item);
                const urgency = getUrgency(item);
                const visualStatus = overdue ? "OVERDUE" : item.status;
                return (
                  <tr className={urgency.className ? `installment-row-${urgency.className}` : ""} key={item.id}>
                    <td data-label="Cliente"><div className="installment-client"><strong>{item.sale?.client?.name || "-"}</strong><small>DNI {item.sale?.client?.dni || "-"}</small></div></td>
                    <td data-label="Moto"><div className="installment-moto"><strong>{item.sale?.motorcycle?.brand} {item.sale?.motorcycle?.model}</strong><small>{item.sale?.motorcycle?.domain || `Venta #${item.sale?.saleNumber || item.saleId}`}</small></div></td>
                    <td data-label="Cuota"><strong>{item.number}</strong><span> / {item.sale?.installmentPlan || "-"}</span></td>
                    <td data-label="Vencimiento" className={overdue ? "overdue-date" : ""}>
                      <div className="installment-due-date"><span>{date.format(new Date(item.dueDate))}</span>{urgency.label && <small className={urgency.className}>{urgency.label}</small>}</div>
                    </td>
                    <td data-label="Importe" className="installment-money">
                      {money.format(Number(item.status === "PAID" ? item.payment?.amount || item.amount : item.amount))}
                      {Number(item.payment?.interestRate || 0) > 0 && <small>Incluye {item.payment.interestRate}% de interes</small>}
                      {Number(item.payment?.carriedBalance || 0) > 0 && <small>Saldo trasladado: {money.format(Number(item.payment.carriedBalance))}</small>}
                    </td>
                    <td data-label="Estado"><span className={`installment-status ${visualStatus.toLowerCase()}`}>{visualStatus === "OVERDUE" ? "Vencida" : visualStatus === "PAID" ? "Pagada" : visualStatus === "CANCELLED" ? "Cancelada" : "Pendiente"}</span></td>
                    <td className="installment-action-cell">
                      <div className="installment-row-actions">
                        {item.status === "PENDING" && canCollect && <button className="collect-button" onClick={() => setSelectedInstallment(item)}><FiDollarSign />Cobrar</button>}
                        {item.status === "PENDING" && canManagePlan && <button className="installment-edit-button" onClick={() => setInstallmentToEdit(item)} aria-label={`Editar cuota ${item.number}`} title="Editar cuota"><FiEdit2 /></button>}
                        {item.status === "PAID" && <span className="paid-mark"><FiCheckCircle />{item.payment?.method === "TRANSFER" ? "Transferencia" : item.payment?.method === "CARD" ? "Tarjeta" : item.payment?.method === "OTHER" ? "Otro" : "Efectivo"}</span>}
                        {item.status === "CANCELLED" && "-"}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="installments-empty"><FiCreditCard /><strong>No hay cuotas para mostrar</strong><span>Cambia el filtro o la busqueda seleccionada.</span></div>
        )}
      </div>

      {selectedInstallment && <PaymentModal installment={selectedInstallment} onClose={() => setSelectedInstallment(null)} onPaid={handlePaid} />}
      {installmentToEdit && <InstallmentFormModal installment={installmentToEdit} onClose={() => setInstallmentToEdit(null)} onSaved={handleUpdated} />}
    </section>
  );
}

export default Installments;
