import { useEffect } from "react";
import { FiCheckCircle, FiClock, FiX } from "react-icons/fi";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const date = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" });

function SaleDetailModal({ sale, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const paidCount = sale.installments.filter((item) => item.status === "PAID").length;

  return (
    <div className="sale-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sale-modal sale-detail-modal" role="dialog" aria-modal="true" aria-labelledby="sale-detail-title">
        <header className="sale-modal-header">
          <div><h2 id="sale-detail-title">Venta #{sale.id}</h2><p>{sale.client?.name} · {sale.motorcycle?.brand} {sale.motorcycle?.model}</p></div>
          <button className="sale-modal-close" onClick={onClose} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>
        <div className="sale-detail-body">
          <div className="sale-summary-grid">
            <div><span>Precio</span><strong>{money.format(Number(sale.salePrice))}</strong></div>
            <div><span>Entrega</span><strong>{money.format(Number(sale.downPayment))}</strong></div>
            <div><span>Financiado</span><strong>{money.format(Number(sale.financedAmount))}</strong></div>
            <div><span>Progreso</span><strong>{paidCount} de {sale.installmentPlan}</strong></div>
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
  );
}

export default SaleDetailModal;
