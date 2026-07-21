import { useEffect, useState } from "react";
import { FiPrinter, FiX } from "react-icons/fi";
import moyanoLogo from "../../assets/moyano-logo.png";
import { getApiError } from "../../services/api.js";
import { markSaleReceiptPrinted } from "../../services/saleService.js";
import "./SaleReceiptViewer.css";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const shortDate = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
const dateTime = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});

function SaleReceiptViewer({ sale, onClose }) {
  const [receipt, setReceipt] = useState(sale.saleReceipt);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const totalFinanced = Number(sale.totalFinancedAmount || sale.financedAmount);

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
      const updatedReceipt = await markSaleReceiptPrinted(sale.id);
      setReceipt(updatedReceipt);
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
      <section className="sale-receipt-viewer" role="dialog" aria-modal="true" aria-labelledby="sale-receipt-title">
        <header className="sale-receipt-viewer-header sale-receipt-screen-only">
          <div>
            <h2 id="sale-receipt-title">Recibo de venta</h2>
            <p>{receipt.receiptNumber}</p>
          </div>
          <button type="button" onClick={onClose} disabled={printing} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        {error && <div className="sale-receipt-error sale-receipt-screen-only" role="alert">{error}</div>}

        <div className="sale-receipt-paper-wrap">
          <article className="sale-receipt-print-sheet">
            <header className="sale-receipt-brand-header">
              <div className="sale-receipt-brand">
                <img src={moyanoLogo} alt="Moyano Motos" />
                <small>Comprobante de venta financiada</small>
              </div>
              <div className="sale-receipt-number">
                <span>RECIBO DE VENTA</span>
                <strong>{receipt.receiptNumber}</strong>
                <small>{dateTime.format(new Date(receipt.createdAt))}</small>
              </div>
            </header>

            <section className="sale-receipt-client">
              <div><span>Cliente</span><strong>{sale.client?.name || "-"}</strong></div>
              <div><span>DNI</span><strong>{sale.client?.dni || "-"}</strong></div>
              <div><span>Telefono</span><strong>{sale.client?.phone || "-"}</strong></div>
              <div className="sale-receipt-wide"><span>Domicilio</span><strong>{sale.client?.address || "Sin domicilio registrado"}</strong></div>
            </section>

            <section className="sale-receipt-section">
              <h3>Detalle de la venta</h3>
              <div className="sale-receipt-detail-grid">
                <div><span>Venta</span><strong>#{sale.saleNumber}</strong></div>
                <div><span>Fecha</span><strong>{shortDate.format(new Date(sale.saleDate))}</strong></div>
                <div><span>Vendedor</span><strong>{sale.seller?.name || "-"}</strong></div>
                <div><span>Moto</span><strong>{sale.motorcycle?.brand} {sale.motorcycle?.model}</strong></div>
                <div><span>Dominio</span><strong>{sale.motorcycle?.domain || "Sin registrar"}</strong></div>
                <div><span>Color / Anio</span><strong>{sale.motorcycle?.color || "-"} / {sale.motorcycle?.year || "-"}</strong></div>
                <div className="sale-receipt-wide"><span>Chasis</span><strong>{sale.motorcycle?.chassisNumber || "Sin registrar"}</strong></div>
                <div className="sale-receipt-wide"><span>Motor</span><strong>{sale.motorcycle?.engineNumber || "Sin registrar"}</strong></div>
              </div>
            </section>

            <section className="sale-receipt-financing">
              <div><span>Precio de venta</span><strong>{money.format(Number(sale.salePrice))}</strong></div>
              <div><span>Entrega</span><strong>{money.format(Number(sale.downPayment))}</strong></div>
              <div><span>Capital financiado</span><strong>{money.format(Number(sale.financedAmount))}</strong></div>
              <div><span>Interes ({sale.financingInterestRate || 0}%)</span><strong>{money.format(Number(sale.financingInterestAmount || 0))}</strong></div>
              <div className="sale-receipt-total"><span>Total en cuotas</span><strong>{money.format(totalFinanced)}</strong></div>
              <div><span>Plan</span><strong>{sale.installmentPlan} cuotas</strong></div>
            </section>

            <section className="sale-receipt-section sale-receipt-plan">
              <h3>Plan de cuotas</h3>
              <table>
                <thead><tr><th>Cuota</th><th>Vencimiento</th><th>Importe</th></tr></thead>
                <tbody>
                  {sale.installments.map((installment) => (
                    <tr key={installment.id}>
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
            <FiPrinter />{printing ? "Preparando..." : "Imprimir recibo"}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default SaleReceiptViewer;
