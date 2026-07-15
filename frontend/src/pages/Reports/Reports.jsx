import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiBarChart2, FiCalendar, FiCreditCard, FiDollarSign, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { getCollectionsReport, getDebtReport, getOverdueReport, getSalesReport } from "../../services/reportService.js";
import "./Reports.css";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

const toInputDate = (value) => {
  const offset = value.getTimezoneOffset();
  return new Date(value.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const initialRange = () => {
  const today = new Date();
  return {
    from: toInputDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    to: toInputDate(today)
  };
};

const methodLabels = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  CARD: "Tarjeta",
  OTHER: "Otros"
};

function Reports() {
  const { user } = useAuth();
  const [draftRange, setDraftRange] = useState(initialRange);
  const [range, setRange] = useState(initialRange);
  const [collections, setCollections] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [debt, setDebt] = useState(null);
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = user.role === "ADMIN";

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isAdmin) {
        const [collectionsData, overdueData, debtData, salesData] = await Promise.all([
          getCollectionsReport(range),
          getOverdueReport(),
          getDebtReport(),
          getSalesReport(range)
        ]);
        setCollections(collectionsData);
        setOverdue(overdueData);
        setDebt(debtData);
        setSales(salesData);
      } else {
        const [collectionsData, overdueData] = await Promise.all([
          getCollectionsReport(range),
          getOverdueReport()
        ]);
        setCollections(collectionsData);
        setOverdue(overdueData);
      }
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar los reportes"));
    } finally {
      setLoading(false);
    }
  }, [isAdmin, range]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const paymentMethods = useMemo(() => {
    const totals = (collections?.payments || []).reduce((result, payment) => {
      result[payment.method] = (result[payment.method] || 0) + Number(payment.amount);
      return result;
    }, {});
    const max = Math.max(...Object.values(totals), 1);
    return Object.entries(methodLabels).map(([method, label]) => ({
      method,
      label,
      amount: totals[method] || 0,
      percentage: ((totals[method] || 0) / max) * 100
    }));
  }, [collections]);

  const overdueAmount = overdue.reduce((sum, item) => sum + Number(item.amount), 0);

  const applyRange = (event) => {
    event.preventDefault();
    if (draftRange.from > draftRange.to) {
      setError("La fecha desde no puede ser posterior a la fecha hasta");
      return;
    }
    setRange({ ...draftRange });
  };

  return (
    <section className="reports-page">
      <header className="reports-header">
        <div><p>Analisis</p><h1>Reportes</h1><span>Resumen financiero y seguimiento de cobranzas.</span></div>
        <form className="report-range" onSubmit={applyRange}>
          <FiCalendar />
          <label><span>Desde</span><input type="date" value={draftRange.from} onChange={(event) => setDraftRange((current) => ({ ...current, from: event.target.value }))} required /></label>
          <label><span>Hasta</span><input type="date" value={draftRange.to} onChange={(event) => setDraftRange((current) => ({ ...current, to: event.target.value }))} required /></label>
          <button type="submit" disabled={loading} title="Aplicar rango"><FiRefreshCw className={loading ? "is-spinning" : ""} /><span>Aplicar</span></button>
        </form>
      </header>

      {error && <div className="reports-error" role="alert">{error}<button onClick={loadReports}>Reintentar</button></div>}

      <div className={`report-metrics ${isAdmin ? "admin-metrics" : ""}`}>
        <article><span className="report-metric-icon collections"><FiDollarSign /></span><div><p>Cobrado en el periodo</p><strong>{loading ? "--" : money.format(Number(collections?.totalAmount || 0))}</strong><small>{collections?.totalPayments || 0} pagos registrados</small></div></article>
        <article><span className="report-metric-icon overdue"><FiAlertCircle /></span><div><p>Deuda vencida</p><strong>{loading ? "--" : money.format(overdueAmount)}</strong><small>{overdue.length} cuotas vencidas</small></div></article>
        {isAdmin && <article><span className="report-metric-icon sales"><FiTrendingUp /></span><div><p>Ventas del periodo</p><strong>{loading ? "--" : sales?.totalSales || 0}</strong><small>{money.format(Number(sales?.salePrice || 0))} vendidos</small></div></article>}
        {isAdmin && <article><span className="report-metric-icon debt"><FiCreditCard /></span><div><p>Saldo pendiente total</p><strong>{loading ? "--" : money.format(Number(debt?.pending?.amount || 0))}</strong><small>{debt?.pending?.count || 0} cuotas pendientes</small></div></article>}
      </div>

      <div className="report-main-grid">
        <article className="report-panel methods-panel">
          <header><div><h2>Cobranzas por medio de pago</h2><p>Distribucion del importe cobrado en el periodo</p></div><FiBarChart2 /></header>
          {loading ? <div className="report-panel-loading"><span /><span /><span /></div> : (
            <div className="payment-method-list">
              {paymentMethods.map((item) => <div className="payment-method-row" key={item.method}>
                <div><strong>{item.label}</strong><span>{money.format(item.amount)}</span></div>
                <div className="method-track"><span style={{ width: `${item.percentage}%` }} /></div>
              </div>)}
            </div>
          )}
        </article>

        {isAdmin && <article className="report-panel sales-summary-panel">
          <header><div><h2>Composicion de ventas</h2><p>Importes acumulados en el periodo</p></div><FiTrendingUp /></header>
          <div className="sales-report-values">
            <div><span>Precio total vendido</span><strong>{loading ? "--" : money.format(Number(sales?.salePrice || 0))}</strong></div>
            <div><span>Entregas recibidas</span><strong>{loading ? "--" : money.format(Number(sales?.downPayment || 0))}</strong></div>
            <div><span>Monto financiado</span><strong>{loading ? "--" : money.format(Number(sales?.financedAmount || 0))}</strong></div>
          </div>
        </article>}

        {!isAdmin && <article className="report-panel collection-summary-panel">
          <header><div><h2>Actividad del periodo</h2><p>Resumen de operaciones cobradas</p></div><FiCreditCard /></header>
          <div className="collector-summary"><strong>{collections?.totalPayments || 0}</strong><span>pagos por un total de</span><b>{money.format(Number(collections?.totalAmount || 0))}</b></div>
        </article>}
      </div>

      <article className="report-table-panel">
        <header><div><h2>Detalle de cobranzas</h2><p>Pagos dentro del rango seleccionado</p></div><span>{collections?.payments?.length || 0} movimientos</span></header>
        <div className="report-table-scroll">
          {loading ? <div className="report-table-loading"><span /><span /><span /></div> : collections?.payments?.length ? (
            <table className="report-table"><thead><tr><th>Fecha</th><th>Cliente</th><th>Cuota</th><th>Medio</th><th>Cobrador</th><th>Importe</th></tr></thead><tbody>
              {collections.payments.map((payment) => <tr key={payment.id}>
                <td data-label="Fecha">{date.format(new Date(payment.paidAt))}</td>
                <td data-label="Cliente"><div><strong>{payment.installment?.sale?.client?.name || "-"}</strong><small>DNI {payment.installment?.sale?.client?.dni || "-"}</small></div></td>
                <td data-label="Cuota">N.º {payment.installment?.number} · Venta #{payment.installment?.saleId}</td>
                <td data-label="Medio">{methodLabels[payment.method] || payment.method}</td>
                <td data-label="Cobrador">{payment.user?.name || "-"}</td>
                <td data-label="Importe" className="report-money">{money.format(Number(payment.amount))}</td>
              </tr>)}
            </tbody></table>
          ) : <div className="report-empty"><FiDollarSign /><strong>Sin cobranzas en el periodo</strong><span>Selecciona otro rango de fechas para consultar.</span></div>}
        </div>
      </article>

      <article className="report-table-panel overdue-report-panel">
        <header><div><h2>Cartera vencida</h2><p>Cuotas pendientes con fecha de vencimiento superada</p></div><span>{overdue.length} cuotas</span></header>
        <div className="report-table-scroll">
          {loading ? <div className="report-table-loading"><span /><span /><span /></div> : overdue.length ? (
            <table className="report-table overdue-report-table"><thead><tr><th>Cliente</th><th>Contacto</th><th>Moto</th><th>Cuota</th><th>Vencimiento</th><th>Atraso</th><th>Importe</th></tr></thead><tbody>
              {overdue.map((item) => {
                const days = Math.max(1, Math.floor((Date.now() - new Date(item.dueDate)) / 86400000));
                return <tr key={item.id}>
                  <td data-label="Cliente"><div><strong>{item.sale?.client?.name || "-"}</strong><small>DNI {item.sale?.client?.dni || "-"}</small></div></td>
                  <td data-label="Contacto">{item.sale?.client?.phone || "-"}</td>
                  <td data-label="Moto">{item.sale?.motorcycle?.brand} {item.sale?.motorcycle?.model}</td>
                  <td data-label="Cuota">N.º {item.number}</td>
                  <td data-label="Vencimiento">{date.format(new Date(item.dueDate))}</td>
                  <td data-label="Atraso"><span className="delay-badge">{days} {days === 1 ? "dia" : "dias"}</span></td>
                  <td data-label="Importe" className="report-money overdue-money">{money.format(Number(item.amount))}</td>
                </tr>;
              })}
            </tbody></table>
          ) : <div className="report-empty success"><FiCreditCard /><strong>Sin cuotas vencidas</strong><span>La cartera se encuentra al dia.</span></div>}
        </div>
      </article>
    </section>
  );
}

export default Reports;
