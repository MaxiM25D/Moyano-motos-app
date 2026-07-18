import { useEffect, useState } from "react";
import { FiPrinter, FiX } from "react-icons/fi";
import { getApiError } from "../../services/api.js";
import { markReceiptPrinted } from "../../services/receiptService.js";
import moyanoLogo from "../../assets/moyano-logo.png";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const dateTime = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const methodLabels = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  CARD: "Tarjeta",
  OTHER: "Otro"
};

function ReceiptViewer({ receipt, canPrint, onClose, onPrinted }) {
  const [currentReceipt, setCurrentReceipt] = useState(receipt);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const data = currentReceipt.printable;

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
      const updated = await markReceiptPrinted(currentReceipt.id);
      setCurrentReceipt(updated);
      onPrinted(updated);
      window.print();
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo preparar la impresion"));
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="receipt-viewer-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !printing) onClose();
    }}>
      <section className="receipt-viewer" role="dialog" aria-modal="true" aria-labelledby="receipt-view-title">
        <header className="receipt-viewer-header receipt-screen-only">
          <div><h2 id="receipt-view-title">Vista del recibo</h2><p>{currentReceipt.receiptNumber}</p></div>
          <button onClick={onClose} disabled={printing} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>

        {error && <div className="receipt-print-error receipt-screen-only" role="alert">{error}</div>}

        <div className="receipt-paper-wrap">
          <article className="receipt-print-sheet">
            <header className="printed-receipt-header">
              <div className="printed-brand"><img src={moyanoLogo} alt="Moyano Motos" /><small>Comprobante de pago</small></div>
              <div className="printed-number"><span>RECIBO</span><strong>{data.receiptNumber}</strong><small>{dateTime.format(new Date(data.issuedAt))}</small></div>
            </header>

            <section className="receipt-client-block">
              <div><span>Recibimos de</span><strong>{data.client?.name || "-"}</strong></div>
              <div><span>DNI</span><strong>{data.client?.dni || "-"}</strong></div>
              <div><span>Telefono</span><strong>{data.client?.phone || "-"}</strong></div>
              <div className="receipt-wide-detail"><span>Domicilio</span><strong>{data.client?.address || "Sin domicilio registrado"}</strong></div>
            </section>

            <section className="receipt-payment-highlight">
              <span>Importe recibido</span>
              <strong>{money.format(Number(data.payment?.amount || 0))}</strong>
              {Number(data.payment?.interestRate || 0) > 0 && <small>Cuota base: {money.format(Number(data.installment?.amount || 0))} | Interes {data.payment.interestRate}%: {money.format(Number(data.payment.interestAmount || 0))}</small>}
              <small>Medio de pago: {methodLabels[data.payment?.method] || data.payment?.method}</small>
            </section>

            <section className="receipt-concept">
              <h3>Concepto</h3>
              <div className="receipt-detail-grid">
                <div><span>Venta</span><strong>#{data.sale?.id || "-"}</strong></div>
                <div><span>Cuota</span><strong>N.º {data.installment?.number || "-"}</strong></div>
                <div><span>Fecha de pago</span><strong>{data.payment?.paidAt ? dateTime.format(new Date(data.payment.paidAt)) : "-"}</strong></div>
                <div><span>Vencimiento</span><strong>{data.installment?.dueDate ? dateTime.format(new Date(data.installment.dueDate)).split(",")[0] : "-"}</strong></div>
                <div className="receipt-wide-detail"><span>Moto</span><strong>{data.motorcycle ? `${data.motorcycle.brand} ${data.motorcycle.model}${data.motorcycle.domain ? ` · ${data.motorcycle.domain}` : ""}` : "-"}</strong></div>
                {data.payment?.notes && <div className="receipt-wide-detail"><span>Observaciones</span><strong>{data.payment.notes}</strong></div>}
              </div>
            </section>

            <footer className="printed-receipt-footer">
              <div><span>Registrado por</span><strong>{data.collector?.name || "-"}</strong></div>
              <div className="signature-line"><span>Firma y aclaracion</span></div>
            </footer>
          </article>
        </div>

        <footer className="receipt-viewer-actions receipt-screen-only">
          <button className="secondary-button" onClick={onClose} disabled={printing}>Cerrar</button>
          {canPrint && <button className="primary-button" onClick={handlePrint} disabled={printing}><FiPrinter />{printing ? "Preparando..." : "Imprimir recibo"}</button>}
        </footer>
      </section>
    </div>
  );
}

export default ReceiptViewer;
