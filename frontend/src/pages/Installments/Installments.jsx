import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiCreditCard, FiDollarSign, FiSearch, FiX } from "react-icons/fi";
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
  { value: "OVERDUE", label: "Vencidas" },
  { value: "PAID", label: "Pagadas" }
];

const isOverdue = (installment) =>
  installment.status === "PENDING" && new Date(installment.dueDate) < new Date();

function Installments() {
  const { user } = useAuth();
  const [installments, setInstallments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const canCollect = ["ADMIN", "COLLECTOR"].includes(user.role);

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

  const visibleInstallments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return installments.filter((item) => {
      const matchesFilter = filter === "ALL"
        || (filter === "OVERDUE" ? isOverdue(item) : item.status === filter);
      const matchesSearch = !term || [
        item.sale?.client?.name,
        item.sale?.client?.dni,
        item.sale?.motorcycle?.brand,
        item.sale?.motorcycle?.model,
        item.sale?.motorcycle?.domain,
        item.saleId
      ].some((value) => String(value || "").toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });
  }, [filter, installments, search]);

  const handlePaid = async (paidInstallment) => {
    setSelectedInstallment(null);
    setNotice(`El pago de la cuota ${paidInstallment.number} fue registrado correctamente.`);
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
          {filters.map((item) => <button className={filter === item.value ? "is-active" : ""} key={item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}
        </div>
        <div className="installments-search"><FiSearch /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cliente, DNI, moto o venta" aria-label="Buscar cuotas" />{search && <button onClick={() => setSearch("")} aria-label="Limpiar busqueda" title="Limpiar busqueda"><FiX /></button>}</div>
      </div>

      <div className="installments-table-wrap">
        {loading ? (
          <div className="installments-loading"><span /><span /><span /><span /></div>
        ) : visibleInstallments.length ? (
          <table className="installments-table">
            <thead><tr><th>Cliente</th><th>Moto</th><th>Cuota</th><th>Vencimiento</th><th>Importe</th><th>Estado</th><th>Pago</th></tr></thead>
            <tbody>
              {visibleInstallments.map((item) => {
                const overdue = isOverdue(item);
                const visualStatus = overdue ? "OVERDUE" : item.status;
                return (
                  <tr key={item.id}>
                    <td data-label="Cliente"><div className="installment-client"><strong>{item.sale?.client?.name || "-"}</strong><small>DNI {item.sale?.client?.dni || "-"}</small></div></td>
                    <td data-label="Moto"><div className="installment-moto"><strong>{item.sale?.motorcycle?.brand} {item.sale?.motorcycle?.model}</strong><small>{item.sale?.motorcycle?.domain || `Venta #${item.saleId}`}</small></div></td>
                    <td data-label="Cuota"><strong>{item.number}</strong><span> / {item.sale?.installmentPlan || "-"}</span></td>
                    <td data-label="Vencimiento" className={overdue ? "overdue-date" : ""}>{date.format(new Date(item.dueDate))}</td>
                    <td data-label="Importe" className="installment-money">{money.format(Number(item.amount))}</td>
                    <td data-label="Estado"><span className={`installment-status ${visualStatus.toLowerCase()}`}>{visualStatus === "OVERDUE" ? "Vencida" : visualStatus === "PAID" ? "Pagada" : visualStatus === "CANCELLED" ? "Cancelada" : "Pendiente"}</span></td>
                    <td className="installment-action-cell">
                      {item.status === "PENDING" && canCollect ? <button className="collect-button" onClick={() => setSelectedInstallment(item)}><FiDollarSign />Cobrar</button> : item.status === "PAID" ? <span className="paid-mark"><FiCheckCircle />{item.payment?.method === "TRANSFER" ? "Transferencia" : item.payment?.method === "CARD" ? "Tarjeta" : item.payment?.method === "OTHER" ? "Otro" : "Efectivo"}</span> : "-"}
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
    </section>
  );
}

export default Installments;
