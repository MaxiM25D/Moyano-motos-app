import { useEffect, useState } from "react";
import { FiCheckCircle, FiChevronDown, FiChevronUp, FiClock, FiFileText, FiX } from "react-icons/fi";
import SaleReceiptViewer from "./SaleReceiptViewer.jsx";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const date = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" });

function SaleDetailModal({ sale, onClose }) {
  const [motorcycleDetailsOpen, setMotorcycleDetailsOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => event.key === "Escape" && !receiptOpen && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, receiptOpen]);

  const paidCount = sale.installments.filter((item) => item.status === "PAID").length;
  const totalFinanced = Number(sale.totalFinancedAmount || sale.financedAmount);

  return (
    <>
      <div className="sale-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sale-modal sale-detail-modal" role="dialog" aria-modal="true" aria-labelledby="sale-detail-title">
        <header className="sale-modal-header">
          <div>
            <h2 id="sale-detail-title">Venta #{sale.saleNumber}</h2>
            <div className="sale-detail-subtitle">
              <p>{sale.client?.name} - {sale.motorcycle?.brand} {sale.motorcycle?.model}</p>
              <button
                className="motorcycle-details-toggle"
                type="button"
                onClick={() => setMotorcycleDetailsOpen((open) => !open)}
                aria-expanded={motorcycleDetailsOpen}
                aria-controls="sale-motorcycle-details"
              >
                {motorcycleDetailsOpen ? "Ocultar" : "Ver mas"}
                {motorcycleDetailsOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>
          <button className="sale-modal-close" onClick={onClose} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>
        <div className="sale-detail-body">
          {motorcycleDetailsOpen && (
            <section className="sale-motorcycle-details" id="sale-motorcycle-details">
              <div className="motorcycle-details-heading">
                <h3>Datos de la moto</h3>
                <span>{sale.motorcycle?.brand} {sale.motorcycle?.model}</span>
              </div>
              <dl className="motorcycle-details-grid">
                <div><dt>Dominio</dt><dd>{sale.motorcycle?.domain || "Sin registrar"}</dd></div>
                <div><dt>Color</dt><dd>{sale.motorcycle?.color || "Sin registrar"}</dd></div>
                <div><dt>Anio</dt><dd>{sale.motorcycle?.year || "Sin registrar"}</dd></div>
                <div><dt>Numero de chasis</dt><dd>{sale.motorcycle?.chassisNumber || "Sin registrar"}</dd></div>
                <div><dt>Numero de motor</dt><dd>{sale.motorcycle?.engineNumber || "Sin registrar"}</dd></div>
              </dl>
            </section>
          )}

          <div className="sale-summary-grid">
            <div><span>Precio</span><strong>{money.format(Number(sale.salePrice))}</strong></div>
            <div><span>Entrega</span><strong>{money.format(Number(sale.downPayment))}</strong></div>
            <div><span>Capital financiado</span><strong>{money.format(Number(sale.financedAmount))}</strong></div>
            <div><span>Interes ({sale.financingInterestRate || 0}%)</span><strong>{money.format(Number(sale.financingInterestAmount || 0))}</strong></div>
            <div><span>Total en cuotas</span><strong>{money.format(totalFinanced)}</strong></div>
            <div><span>Progreso</span><strong>{paidCount} de {sale.installmentPlan}</strong></div>
          </div>

          <div className="sale-receipt-access">
            <button type="button" onClick={() => setReceiptOpen(true)} disabled={!sale.saleReceipt}>
              <FiFileText /> Ver recibo de venta
            </button>
            {sale.saleReceipt && <span>{sale.saleReceipt.receiptNumber}</span>}
          </div>

          <div className="installments-detail-header"><h3>Plan de cuotas</h3><span>{sale.installmentPlan} cuotas</span></div>
          <div className="installments-detail-list">
            {sale.installments.map((installment) => (
              <div className="installment-detail-row" key={installment.id}>
                <span className={`installment-status-icon ${installment.status.toLowerCase()}`}>
                  {installment.status === "PAID" ? <FiCheckCircle /> : <FiClock />}
                </span>
                <div><strong>Cuota {installment.number}</strong><span>Vence {date.format(new Date(installment.dueDate))}</span></div>
                <strong>{money.format(Number(installment.amount))}</strong>
                <span className={`sale-status ${installment.status.toLowerCase()}`}>{installment.status === "PAID" ? "Pagada" : installment.status === "CANCELLED" ? "Cancelada" : "Pendiente"}</span>
              </div>
            ))}
          </div>
        </div>
        </section>
      </div>
      {receiptOpen && sale.saleReceipt && <SaleReceiptViewer sale={sale} onClose={() => setReceiptOpen(false)} />}
    </>
  );
}

export default SaleDetailModal;
