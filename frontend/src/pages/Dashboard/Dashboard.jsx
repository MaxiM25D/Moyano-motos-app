import { useCallback, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowRight,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiRefreshCw
} from "react-icons/fi";
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

const monthFormatter = new Intl.DateTimeFormat("es-AR", {
  month: "short",
  timeZone: "UTC"
});

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";

const argentinaDateParts = (value) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return [Number(values.year), Number(values.month), Number(values.day)];
};

const dueDateParts = (value) => String(value).slice(0, 10).split("-").map(Number);
const calendarDay = ([year, month, day]) => Date.UTC(year, month - 1, day);

const daysUntilDue = (installment) => Math.round(
  (calendarDay(dueDateParts(installment.dueDate)) - calendarDay(argentinaDateParts(new Date()))) / DAY_IN_MS
);

const getDueAlert = (installment) => {
  const days = daysUntilDue(installment);
  if (days < 0) return { className: "overdue", label: "Vencida" };
  if (days === 0) return { className: "today", label: "Cobrar hoy" };
  if (days === 1) return { className: "tomorrow", label: "Cobrar mañana" };
  return {
    className: days <= 7 ? "soon" : "scheduled",
    label: `Faltan ${days} dias`
  };
};

const installmentLink = (filter, installment) => {
  const params = new URLSearchParams({ filter });
  if (installment?.sale?.client?.name) params.set("search", installment.sale.client.name);
  return `/cuotas?${params.toString()}`;
};

const emptyDashboard = {
  paid: { count: 0, amount: 0, clients: { paid: 0, active: 0 } },
  pending: { count: 0, amount: 0 },
  overdue: { count: 0, amount: 0 },
  upcomingInstallments: [],
  attentionRequired: []
};

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(emptyDashboard);
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

  const monthLabel = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric"
  }).format(new Date());

  return (
    <section className="dashboard">
      <header className="page-header">
        <div>
          <p>{new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</p>
          <h1>Hola, {user.name.split(" ")[0]}</h1>
          <span>Resumen de cobranzas de {monthLabel}.</span>
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
        <Link className="metric-card metric-card-link paid-card" to="/cuotas?filter=PAID&period=CURRENT_MONTH" aria-label="Ver cuotas pagadas este mes">
          <FiArrowRight className="metric-card-arrow" />
          <span className="metric-icon green"><FiCheckCircle /></span>
          <div className="metric-content">
            <p>Cuotas pagadas este mes</p>
            <div className="metric-count">
              <strong>{loading ? "--" : data.paid.count}</strong>
              <span>cuotas cobradas</span>
            </div>
            <div className="metric-client-count">
              <span>Clientes que pagaron</span>
              <strong>{loading ? "-- / --" : `${data.paid.clients?.paid || 0} / ${data.paid.clients?.active || 0}`}</strong>
            </div>
            <div className="metric-amount">
              <span>Monto ingresado</span>
              <b>{loading ? "--" : money.format(Number(data.paid.amount))}</b>
            </div>
          </div>
        </Link>

        <Link className="metric-card metric-card-link pending-card" to="/cuotas?filter=PENDING" aria-label="Ver cuotas pendientes">
          <FiArrowRight className="metric-card-arrow" />
          <span className="metric-icon blue"><FiCreditCard /></span>
          <div className="metric-content">
            <p>Cuotas pendientes del mes</p>
            <div className="metric-count">
              <strong>{loading ? "--" : data.pending.count}</strong>
              <span>por cobrar</span>
            </div>
            <div className="metric-amount">
              <span>Monto esperado</span>
              <b>{loading ? "--" : money.format(Number(data.pending.amount))}</b>
            </div>
          </div>
        </Link>

        <Link className="metric-card metric-card-link overdue-card" to="/cuotas?filter=OVERDUE" aria-label="Ver cuotas vencidas">
          <FiArrowRight className="metric-card-arrow" />
          <span className="metric-icon red"><FiAlertCircle /></span>
          <div className="metric-content">
            <p>Cuotas vencidas este mes</p>
            <div className="metric-count">
              <strong>{loading ? "--" : data.overdue.count}</strong>
              <span>cuotas atrasadas</span>
            </div>
            <div className="metric-amount overdue">
              <span>Saldo adeudado</span>
              <b>{loading ? "--" : money.format(Number(data.overdue.amount))}</b>
            </div>
          </div>
        </Link>
      </div>

      <div className="dashboard-grid">
        <article className="data-panel">
          <header className="panel-header">
            <div><h2>Proximos vencimientos</h2><p>Prioridad de cobro por fecha</p></div>
            <Link className="text-button" to="/cuotas">Ver todas <FiArrowRight /></Link>
          </header>
          {loading ? (
            <div className="table-loading"><span /><span /><span /></div>
          ) : data.upcomingInstallments.length ? (
            <div className="installment-list">
              {data.upcomingInstallments.map((installment) => {
                const dueAlert = getDueAlert(installment);
                return (
                  <Link className={`installment-row installment-row-link due-${dueAlert.className}`} to={installmentLink("PENDING", installment)} key={installment.id}>
                    <span className="date-box">
                      <strong>{new Date(installment.dueDate).getUTCDate()}</strong>
                      <small>{monthFormatter.format(new Date(installment.dueDate)).replace(".", "")}</small>
                    </span>
                    <div className="installment-info">
                      <strong>{installment.sale?.client?.name || `Venta #${installment.sale?.saleNumber || installment.saleId}`}</strong>
                      <span>Cuota {installment.number} - {installment.sale?.motorcycle ? `${installment.sale.motorcycle.brand} ${installment.sale.motorcycle.model}` : "Moto financiada"}</span>
                      <small className={`due-alert ${dueAlert.className}`}><FiBell />{dueAlert.label}</small>
                    </div>
                    <strong className="installment-amount">{money.format(Number(installment.amount))}</strong>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-state"><FiCalendar /><strong>Sin vencimientos proximos</strong><span>No hay cuotas pendientes para mostrar.</span></div>
          )}
        </article>

        <article className="data-panel overdue-panel">
          <header className="panel-header">
            <div><h2>Atencion requerida</h2><p>Cuotas vencidas durante el mes actual</p></div>
            <Link className="text-button" to="/cuotas?filter=OVERDUE">Ver todas <FiArrowRight /></Link>
          </header>
          {loading ? (
            <div className="table-loading"><span /><span /><span /></div>
          ) : data.attentionRequired.length ? (
            <div className="overdue-list">
              {data.attentionRequired.map((installment) => {
                const days = Math.max(1, Math.abs(daysUntilDue(installment)));
                return (
                  <Link className="overdue-row overdue-row-link" to={installmentLink("OVERDUE", installment)} key={installment.id}>
                    <div>
                      <strong>{installment.sale?.client?.name || `Venta #${installment.sale?.saleNumber || installment.saleId}`}</strong>
                      <span>{days} {days === 1 ? "dia" : "dias"} de atraso</span>
                    </div>
                    <strong>{money.format(Number(installment.amount))}</strong>
                  </Link>
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
