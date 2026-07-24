import { useEffect, useState } from "react";
import { FiPrinter, FiX } from "react-icons/fi";
import moyanoLogo from "../../assets/moyano-logo.png";
import { getApiError } from "../../services/api.js";
import { markRefinancingReceiptPrinted } from "../../services/refinancingService.js";
import "./SaleReceiptViewer.css";
import "./Refinancing.css";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const shortDate = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
const dateTime = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});

function RefinancingReceiptViewer({ sale, refinancing: initialRefinancing, onClose }) {
  const [refinancing, setRefinancing] = useState(initialRefinancing);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !printing) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, printing]);

  const handlePrint = async () => {
    setPrinting(true);
    setError("");
    try {
      const updated = await markRefinancingReceiptPrinted(refinancing.id);
      setRefinancing(updated);
      window.print();
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo preparar la impresion"));
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="sale-receipt-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !printing) onClose();
    }}>
      <section className="sale-receipt-viewer" role="dialog" aria-modal="true" aria-labelledby="refinancing-receipt-title">
        <header className="sale-receipt-viewer-header sale-receipt-screen-only">
          <div>
            <h2 id="refinancing-receipt-title">Comprobante de refinanciacion</h2>
            <p>{refinancing.receiptNumber}</p>
          </div>
          <button type="button" onClick={onClose} disabled={printing} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        {error && <div className="sale-receipt-error sale-receipt-screen-only" role="alert">{error}</div>}

        <div className="sale-receipt-paper-wrap">
          <article className="sale-receipt-print-sheet refinancing-receipt-sheet">
            <header className="sale-receipt-brand-header">
              <div className="sale-receipt-brand">
                <img src={moyanoLogo} alt="Moyano Motos" />
                <small>Acuerdo de refinanciacion</small>
              </div>
              <div className="sale-receipt-number">
                <span>REFINANCIACION</span>
                <strong>{refinancing.receiptNumber}</strong>
                <small>{dateTime.format(new Date(refinancing.createdAt))}</small>
              </div>
            </header>

            <section className="sale-receipt-client">
              <div><span>Cliente</span><strong>{sale.client?.name || "-"}</strong></div>
              <div><span>DNI</span><strong>{sale.client?.dni || "-"}</strong></div>
              <div><span>Telefono</span><strong>{sale.client?.phone || "-"}</strong></div>
              <div className="sale-receipt-wide"><span>Domicilio</span><strong>{sale.client?.address || "Sin domicilio registrado"}</strong></div>
            </section>

            <section className="sale-receipt-section">
              <h3>Operacion refinanciada</h3>
              <div className="sale-receipt-detail-grid">
                <div><span>Venta</span><strong>#{sale.saleNumber}</strong></div>
                <div><span>Moto</span><strong>{sale.motorcycle?.brand} {sale.motorcycle?.model}</strong></div>
                <div><span>Dominio</span><strong>{sale.motorcycle?.domain || "Sin registrar"}</strong></div>
                <div><span>Desde cuota</span><strong>N. {refinancing.startInstallmentNumber}</strong></div>
                <div><span>Registrado por</span><strong>{refinancing.createdBy?.name || "-"}</strong></div>
                <div><span>Fecha</span><strong>{shortDate.format(new Date(refinancing.createdAt))}</strong></div>
              </div>
            </section>

            <section className="sale-receipt-financing">
              <div><span>Saldo anterior</span><strong>{money.format(Number(refinancing.previousBalance))}</strong></div>
              <div><span>Interes ({refinancing.interestRate}%)</span><strong>{money.format(Number(refinancing.interestAmount))}</strong></div>
              <div className="sale-receipt-total"><span>Nuevo total</span><strong>{money.format(Number(refinancing.totalAmount))}</strong></div>
              <div><span>Nuevas cuotas</span><strong>{refinancing.installmentCount}</strong></div>
              <div><span>Cuota base</span><strong>{money.format(Number(refinancing.installmentAmount))}</strong></div>
              <div><span>Primer vencimiento</span><strong>{shortDate.format(new Date(refinancing.firstDueDate))}</strong></div>
            </section>

            {refinancing.notes && (
              <section className="sale-receipt-section refinancing-receipt-notes">
                <h3>Observaciones</h3>
                <p>{refinancing.notes}</p>
              </section>
            )}

            <section className="sale-receipt-section sale-receipt-plan">
              <h3>Nuevo plan de cuotas</h3>
              <table>
                <thead><tr><th>Cuota</th><th>Vencimiento</th><th>Importe</th></tr></thead>
                <tbody>
                  {refinancing.newPlan.map((installment) => (
                    <tr key={installment.number}>
                      <td>N. {installment.number}</td>
                      <td>{shortDate.format(new Date(installment.dueDate))}</td>
                      <td>{money.format(Number(installment.amount))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <footer className="sale-receipt-signatures">
              <div><span>Firma y aclaracion del vendedor</span></div>
              <div><span>Firma y aclaracion del cliente</span></div>
            </footer>
          </article>
        </div>

        <footer className="sale-receipt-actions sale-receipt-screen-only">
          <button className="secondary-button" type="button" onClick={onClose} disabled={printing}>Cerrar</button>
          <button className="primary-button" type="button" onClick={handlePrint} disabled={printing}>
            <FiPrinter />{printing ? "Preparando..." : "Imprimir comprobante"}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default RefinancingReceiptViewer;
