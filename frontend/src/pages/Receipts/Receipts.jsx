import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEye, FiFilePlus, FiFileText, FiPrinter, FiSearch, FiX } from "react-icons/fi";
import ReceiptViewer from "../../components/receipts/ReceiptViewer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { getInstallments } from "../../services/installmentService.js";
import { createReceipt, getReceipts } from "../../services/receiptService.js";
import "./Receipts.css";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

function Receipts() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [tab, setTab] = useState("RECEIPTS");
  const [search, setSearch] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const canManage = ["ADMIN", "COLLECTOR"].includes(user.role);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [receiptList, installmentList] = await Promise.all([getReceipts(), getInstallments()]);
      setReceipts(receiptList);
      setInstallments(installmentList);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar los recibos"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const paymentsWithoutReceipt = useMemo(() => installments.filter((item) =>
    item.status === "PAID" && item.payment && !item.payment.receipt
  ), [installments]);

  const visibleRows = useMemo(() => {
    const source = tab === "RECEIPTS" ? receipts : paymentsWithoutReceipt;
    const term = search.trim().toLowerCase();
    if (!term) return source;
    return source.filter((item) => {
      const printable = item.printable;
      const installment = tab === "RECEIPTS" ? item.payment?.installment : item;
      return [
        item.receiptNumber,
        printable?.client?.name,
        printable?.client?.dni,
        installment?.sale?.client?.name,
        installment?.sale?.client?.dni,
        installment?.sale?.motorcycle?.domain,
        installment?.sale?.saleNumber,
        installment?.saleId
      ].some((value) => String(value || "").toLowerCase().includes(term));
    });
  }, [paymentsWithoutReceipt, receipts, search, tab]);

  const handleGenerate = async (installment) => {
    setGeneratingId(installment.payment.id);
    setError("");
    try {
      const receipt = await createReceipt(installment.payment.id);
      setNotice(`El recibo ${receipt.receiptNumber} fue generado.`);
      await loadData();
      setSelectedReceipt(receipt);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo generar el recibo"));
    } finally {
      setGeneratingId(null);
    }
  };

  const handlePrinted = (updatedReceipt) => {
    setReceipts((current) => current.map((item) => item.id === updatedReceipt.id ? updatedReceipt : item));
    setSelectedReceipt(updatedReceipt);
  };

  return (
    <section className="receipts-page">
      <header className="receipts-header"><div><p>Comprobantes</p><h1>Recibos</h1><span>Emision y consulta de comprobantes de pago.</span></div></header>

      {notice && <div className="receipts-success" role="status">{notice}</div>}
      {error && <div className="receipts-error" role="alert">{error}<button onClick={loadData}>Reintentar</button></div>}

      <div className="receipt-metrics">
        <article><span><FiFileText /></span><div><p>Emitidos</p><strong>{loading ? "--" : receipts.length}</strong><small>Recibos generados</small></div></article>
        <article><span className="print-metric"><FiPrinter /></span><div><p>Impresos</p><strong>{loading ? "--" : receipts.filter((item) => item.printedAt).length}</strong><small>Con fecha de impresion</small></div></article>
        <article><span className="pending-metric"><FiFilePlus /></span><div><p>Sin recibo</p><strong>{loading ? "--" : paymentsWithoutReceipt.length}</strong><small>Pagos disponibles</small></div></article>
      </div>

      <div className="receipts-controls">
        <div className="receipt-tabs">
          <button className={tab === "RECEIPTS" ? "is-active" : ""} onClick={() => setTab("RECEIPTS")}>Recibos emitidos</button>
          <button className={tab === "PENDING" ? "is-active" : ""} onClick={() => setTab("PENDING")}>Pagos sin recibo {paymentsWithoutReceipt.length > 0 && <span>{paymentsWithoutReceipt.length}</span>}</button>
        </div>
        <div className="receipts-search"><FiSearch /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cliente, DNI, dominio o numero" aria-label="Buscar recibos" />{search && <button onClick={() => setSearch("")} aria-label="Limpiar busqueda" title="Limpiar busqueda"><FiX /></button>}</div>
      </div>

      <div className="receipts-table-wrap">
        {loading ? <div className="receipts-loading"><span /><span /><span /><span /></div> : visibleRows.length ? (
          tab === "RECEIPTS" ? (
            <table className="receipts-table"><thead><tr><th>Recibo</th><th>Cliente</th><th>Concepto</th><th>Fecha</th><th>Importe</th><th>Impresion</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>
              {visibleRows.map((receipt) => <tr key={receipt.id}>
                <td data-label="Recibo"><strong>{receipt.receiptNumber}</strong></td>
                <td data-label="Cliente"><div className="receipt-client"><strong>{receipt.printable.client?.name || "-"}</strong><small>DNI {receipt.printable.client?.dni || "-"}</small></div></td>
                <td data-label="Concepto"><div className="receipt-concept-cell"><strong>Cuota {receipt.printable.installment?.number}</strong><small>{receipt.printable.motorcycle?.brand} {receipt.printable.motorcycle?.model}</small></div></td>
                <td data-label="Fecha">{date.format(new Date(receipt.createdAt))}</td>
                <td data-label="Importe" className="receipt-money">{money.format(Number(receipt.printable.payment?.amount || 0))}</td>
                <td data-label="Impresion"><span className={`print-status ${receipt.printedAt ? "printed" : "not-printed"}`}>{receipt.printedAt ? "Impreso" : "Pendiente"}</span></td>
                <td className="receipt-action-cell"><button onClick={() => setSelectedReceipt(receipt)} aria-label={`Ver recibo ${receipt.receiptNumber}`} title="Ver recibo"><FiEye /></button></td>
              </tr>)}
            </tbody></table>
          ) : (
            <table className="receipts-table pending-receipts-table"><thead><tr><th>Cliente</th><th>Moto</th><th>Cuota</th><th>Fecha de pago</th><th>Importe</th><th>Accion</th></tr></thead><tbody>
              {visibleRows.map((item) => <tr key={item.id}>
                <td data-label="Cliente"><div className="receipt-client"><strong>{item.sale?.client?.name || "-"}</strong><small>DNI {item.sale?.client?.dni || "-"}</small></div></td>
                <td data-label="Moto"><div className="receipt-concept-cell"><strong>{item.sale?.motorcycle?.brand} {item.sale?.motorcycle?.model}</strong><small>{item.sale?.motorcycle?.domain || "Sin dominio"}</small></div></td>
                <td data-label="Cuota">N.º {item.number}</td>
                <td data-label="Fecha">{date.format(new Date(item.payment.paidAt))}</td>
                <td data-label="Importe" className="receipt-money">{money.format(Number(item.payment.amount))}</td>
                <td className="generate-receipt-cell">{canManage ? <button onClick={() => handleGenerate(item)} disabled={generatingId === item.payment.id}><FiFilePlus />{generatingId === item.payment.id ? "Generando..." : "Generar"}</button> : "-"}</td>
              </tr>)}
            </tbody></table>
          )
        ) : <div className="receipts-empty"><FiFileText /><strong>{tab === "RECEIPTS" ? "No hay recibos emitidos" : "No hay pagos pendientes de recibo"}</strong><span>{search ? "Proba con otra busqueda." : tab === "RECEIPTS" ? "Los recibos generados apareceran aqui." : "Todos los pagos ya tienen su comprobante."}</span></div>}
      </div>

      {selectedReceipt && <ReceiptViewer receipt={selectedReceipt} canPrint={canManage} onClose={() => setSelectedReceipt(null)} onPrinted={handlePrinted} />}
    </section>
  );
}

export default Receipts;
