import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiArrowRight, FiCalendar, FiCreditCard, FiFileText, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { getDashboardData } from "../../services/dashboardService.js";
import "./Dashboard.css";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ sales: [], pending: [], overdue: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setData(await getDashboardData());
    } catch (requestError) {
      setError(getApiError(requestError, "No pudimos cargar el resumen"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const pendingAmount = data.pending.reduce((total, item) => total + Number(item.amount), 0);
    const overdueAmount = data.overdue.reduce((total, item) => total + Number(item.amount), 0);
    const activeSales = data.sales.filter((sale) => sale.status === "ACTIVE").length;

    return { pendingAmount, overdueAmount, activeSales };
  }, [data]);

  const upcomingInstallments = data.pending
    .filter((item) => !data.overdue.some((overdue) => overdue.id === item.id))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <section className="dashboard">
      <header className="page-header">
        <div>
          <p>{new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</p>
          <h1>Hola, {user.name.split(" ")[0]}</h1>
          <span>Este es el estado actual de las cobranzas.</span>
        </div>
        <button className="refresh-button" onClick={loadDashboard} disabled={loading} title="Actualizar datos">
          <FiRefreshCw className={loading ? "is-spinning" : ""} />
          Actualizar
        </button>
      </header>

      {error && (
        <div className="dashboard-error" role="alert">
          <FiAlertCircle />
          <span>{error}</span>
          <button onClick={loadDashboard}>Reintentar</button>
        </div>
      )}

      <div className="metrics-grid" aria-busy={loading}>
        <article className="metric-card">
          <span className="metric-icon green"><FiFileText /></span>
          <div><p>Ventas activas</p><strong>{loading ? "--" : metrics.activeSales}</strong><small>{data.sales.length} ventas registradas</small></div>
        </article>
        <article className="metric-card">
          <span className="metric-icon blue"><FiCreditCard /></span>
          <div><p>Saldo pendiente</p><strong>{loading ? "--" : money.format(metrics.pendingAmount)}</strong><small>{data.pending.length} cuotas pendientes</small></div>
        </article>
        <article className="metric-card overdue-card">
          <span className="metric-icon red"><FiAlertCircle /></span>
          <div><p>Cuotas vencidas</p><strong>{loading ? "--" : data.overdue.length}</strong><small>{money.format(metrics.overdueAmount)} sin cobrar</small></div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="data-panel">
          <header className="panel-header">
            <div><h2>Proximos vencimientos</h2><p>Cuotas pendientes mas cercanas</p></div>
            <Link className="text-button" to="/cuotas">Ver todas <FiArrowRight /></Link>
          </header>
          {loading ? (
            <div className="table-loading"><span /><span /><span /></div>
          ) : upcomingInstallments.length ? (
            <div className="installment-list">
              {upcomingInstallments.map((installment) => (
                <div className="installment-row" key={installment.id}>
                  <span className="date-box"><strong>{new Date(installment.dueDate).getDate()}</strong><small>{dateFormatter.format(new Date(installment.dueDate)).split(" ")[1]}</small></span>
                  <div className="installment-info">
                    <strong>{installment.sale?.client?.name || `Venta #${installment.saleId}`}</strong>
                    <span>Cuota {installment.number} · {installment.sale?.motorcycle ? `${installment.sale.motorcycle.brand} ${installment.sale.motorcycle.model}` : "Moto financiada"}</span>
                  </div>
                  <strong className="installment-amount">{money.format(Number(installment.amount))}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><FiCalendar /><strong>Sin vencimientos proximos</strong><span>No hay cuotas pendientes para mostrar.</span></div>
          )}
        </article>

        <article className="data-panel overdue-panel">
          <header className="panel-header">
            <div><h2>Atencion requerida</h2><p>Cuotas que ya vencieron</p></div>
          </header>
          {loading ? (
            <div className="table-loading"><span /><span /><span /></div>
          ) : data.overdue.length ? (
            <div className="overdue-list">
              {data.overdue.slice(0, 5).map((installment) => {
                const days = Math.max(1, Math.floor((Date.now() - new Date(installment.dueDate)) / 86400000));
                return (
                  <div className="overdue-row" key={installment.id}>
                    <div><strong>{installment.sale?.client?.name || `Venta #${installment.saleId}`}</strong><span>{days} {days === 1 ? "dia" : "dias"} de atraso</span></div>
                    <strong>{money.format(Number(installment.amount))}</strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state success"><FiCreditCard /><strong>Todo al dia</strong><span>No hay cuotas vencidas.</span></div>
          )}
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
