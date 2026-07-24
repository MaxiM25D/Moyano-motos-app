import { useEffect, useState } from "react";
import { FiCheckCircle, FiChevronDown, FiChevronUp, FiClock, FiDollarSign, FiEdit2, FiFileText, FiPlus, FiRefreshCw, FiTrash2, FiX } from "react-icons/fi";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import InstallmentFormModal from "../installments/InstallmentFormModal.jsx";
import PaymentModal from "../installments/PaymentModal.jsx";
import { getApiError } from "../../services/api.js";
import { deleteInstallment } from "../../services/installmentService.js";
import { getSaleById } from "../../services/saleService.js";
import RefinancingFormModal from "./RefinancingFormModal.jsx";
import RefinancingReceiptViewer from "./RefinancingReceiptViewer.jsx";
import SaleReceiptViewer from "./SaleReceiptViewer.jsx";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const date = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" });

function SaleDetailModal({ sale, canManagePlan, canCollect, onPlanChanged, onClose }) {
  const [motorcycleDetailsOpen, setMotorcycleDetailsOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [addInstallmentOpen, setAddInstallmentOpen] = useState(false);
  const [refinancingOpen, setRefinancingOpen] = useState(false);
  const [selectedRefinancing, setSelectedRefinancing] = useState(null);
  const [installmentToPay, setInstallmentToPay] = useState(null);
  const [installmentToEdit, setInstallmentToEdit] = useState(null);
  const [installmentToDelete, setInstallmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [planError, setPlanError] = useState("");
  const [planNotice, setPlanNotice] = useState("");
  const childDialogOpen = receiptOpen
    || addInstallmentOpen
    || refinancingOpen
    || Boolean(selectedRefinancing)
    || Boolean(installmentToPay)
    || Boolean(installmentToEdit)
    || Boolean(installmentToDelete);

  useEffect(() => {
    const handleKeyDown = (event) => event.key === "Escape" && !childDialogOpen && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [childDialogOpen, onClose]);

  const paidCount = sale.installments.filter((item) => item.status === "PAID").length;
  const pendingCount = sale.installments.filter((item) => item.status === "PENDING").length;
  const paidAmount = Number(sale.paidAmount || 0);
  const outstandingBalance = Number(
    sale.outstandingBalance ?? sale.totalFinancedAmount ?? sale.financedAmount
  );

  const refreshPlan = async (message) => {
    const updatedSale = await getSaleById(sale.id);
    onPlanChanged(updatedSale);
    setPlanNotice(message);
  };

  const handleInstallmentAdded = async (installment) => {
    setAddInstallmentOpen(false);
    setPlanError("");
    try {
      await refreshPlan(`La cuota ${installment.number} fue agregada al plan.`);
    } catch (requestError) {
      setPlanError(getApiError(requestError, "La cuota fue agregada, pero no se pudo actualizar el detalle"));
    }
  };

  const handleInstallmentPlanUpdated = async (installment) => {
    setInstallmentToEdit(null);
    setPlanError("");
    try {
      await refreshPlan(`El plan fue actualizado desde la cuota ${installment.number}.`);
    } catch (requestError) {
      setPlanError(getApiError(requestError, "El plan fue actualizado, pero no se pudo refrescar el detalle"));
    }
  };

  const handleRefinancingCreated = ({ refinancing, sale: updatedSale }) => {
    setRefinancingOpen(false);
    setPlanError("");
    setPlanNotice(`El saldo fue refinanciado en ${refinancing.installmentCount} cuotas.`);
    onPlanChanged(updatedSale);
    setSelectedRefinancing(refinancing);
  };

  const handleInstallmentPaid = async (installment) => {
    setInstallmentToPay(null);
    setPlanError("");
    try {
      await refreshPlan(`El pago de la cuota ${installment.number} fue registrado correctamente.`);
    } catch (requestError) {
      setPlanError(getApiError(requestError, "El pago fue registrado, pero no se pudo refrescar el detalle"));
    }
  };

  const handleDeleteInstallment = async () => {
    setDeleting(true);
    setPlanError("");
    setPlanNotice("");
    try {
      const deletedInstallment = await deleteInstallment(installmentToDelete.id);
      setInstallmentToDelete(null);
      await refreshPlan(`La cuota ${deletedInstallment.number} fue eliminada y el plan fue actualizado.`);
    } catch (requestError) {
      setInstallmentToDelete(null);
      setPlanError(getApiError(requestError, "No se pudo eliminar la cuota"));
    } finally {
      setDeleting(false);
    }
  };

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
                  <div><dt>Año</dt><dd>{sale.motorcycle?.year || "Sin registrar"}</dd></div>
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
              <div className="sale-balance-summary">
                <span>Saldo pendiente</span>
                <strong>{money.format(outstandingBalance)}</strong>
                <small>Pagado hasta hoy: {money.format(paidAmount)}</small>
              </div>
              <div><span>Progreso</span><strong>{paidCount} de {sale.installmentPlan}</strong></div>
            </div>

            <div className="sale-receipt-access">
              <button type="button" onClick={() => setReceiptOpen(true)} disabled={!sale.saleReceipt}>
                <FiFileText /> Ver recibo de venta
              </button>
              {sale.saleReceipt && <span>{sale.saleReceipt.receiptNumber}</span>}
            </div>

            {sale.refinancings?.length > 0 && (
              <section className="sale-refinancing-history">
                <div className="sale-refinancing-history-header">
                  <h3>Refinanciaciones</h3>
                  <span>{sale.refinancings.length}</span>
                </div>
                <div className="sale-refinancing-history-list">
                  {sale.refinancings.map((refinancing) => (
                    <div className="sale-refinancing-history-row" key={refinancing.id}>
                      <div>
                        <strong>Refinanciacion #{refinancing.sequence}</strong>
                        <span>Desde cuota {refinancing.startInstallmentNumber} - {date.format(new Date(refinancing.createdAt))}</span>
                      </div>
                      <div>
                        <span>Nuevo total</span>
                        <strong>{money.format(Number(refinancing.totalAmount))}</strong>
                      </div>
                      <button type="button" onClick={() => setSelectedRefinancing(refinancing)}>
                        <FiFileText /> Ver comprobante
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {planError && <div className="sale-plan-message error" role="alert">{planError}</div>}
            {planNotice && <div className="sale-plan-message success" role="status">{planNotice}</div>}

            <div className="installments-detail-header">
              <h3>Plan de cuotas</h3>
              <div className="installments-detail-tools">
                <span>{sale.installmentPlan} cuotas</span>
                {canManagePlan && pendingCount > 0 && (
                  <button className="sale-refinance-button" type="button" onClick={() => {
                    setPlanError("");
                    setPlanNotice("");
                    setRefinancingOpen(true);
                  }}>
                    <FiRefreshCw /> Refinanciar saldo
                  </button>
                )}
                {canManagePlan && sale.installmentPlan < 60 && (
                  <button type="button" onClick={() => {
                    setPlanError("");
                    setPlanNotice("");
                    setAddInstallmentOpen(true);
                  }} aria-label="Agregar cuota" title="Agregar cuota"><FiPlus /></button>
                )}
              </div>
            </div>
            <div className="installments-detail-list">
              {sale.installments.map((installment) => (
                <div className={`installment-detail-row${canManagePlan ? " manageable" : ""}${canCollect ? " collectable" : ""}`} key={installment.id}>
                  <span className={`installment-status-icon ${installment.status.toLowerCase()}`}>
                    {installment.status === "PAID" ? <FiCheckCircle /> : <FiClock />}
                  </span>
                  <div><strong>Cuota {installment.number}</strong><span>Vence {date.format(new Date(installment.dueDate))}</span></div>
                  <strong>{money.format(Number(installment.amount))}</strong>
                  <span className={`sale-status ${installment.status.toLowerCase()}`}>{installment.status === "PAID" ? "Pagada" : installment.status === "CANCELLED" ? "Cancelada" : "Pendiente"}</span>
                  {(canManagePlan || canCollect) && (
                    installment.status === "PENDING" ? (
                      <div className="sale-installment-actions">
                        {canCollect && (
                          <button className="sale-installment-pay" type="button" onClick={() => {
                            setPlanError("");
                            setPlanNotice("");
                            setInstallmentToPay({ ...installment, sale });
                          }}>
                            <FiDollarSign /> Cobrar
                          </button>
                        )}
                        {canManagePlan && (
                          <div className="sale-installment-plan-actions">
                            <button className="sale-installment-edit" type="button" onClick={() => {
                              setPlanError("");
                              setPlanNotice("");
                              setInstallmentToEdit(installment);
                            }} aria-label={`Editar cuota ${installment.number}`} title="Editar importe y vencimiento"><FiEdit2 /></button>
                            <button className="sale-installment-delete" type="button" onClick={() => setInstallmentToDelete(installment)} aria-label={`Eliminar cuota ${installment.number}`} title="Eliminar cuota"><FiTrash2 /></button>
                          </div>
                        )}
                      </div>
                    ) : <span className="sale-installment-action-placeholder" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {receiptOpen && sale.saleReceipt && <SaleReceiptViewer sale={sale} onClose={() => setReceiptOpen(false)} />}
      {addInstallmentOpen && <InstallmentFormModal sale={sale} onClose={() => setAddInstallmentOpen(false)} onSaved={handleInstallmentAdded} />}
      {refinancingOpen && (
        <RefinancingFormModal
          sale={sale}
          onClose={() => setRefinancingOpen(false)}
          onSaved={handleRefinancingCreated}
        />
      )}
      {selectedRefinancing && (
        <RefinancingReceiptViewer
          sale={sale}
          refinancing={selectedRefinancing}
          onClose={() => setSelectedRefinancing(null)}
        />
      )}
      {installmentToPay && (
        <PaymentModal
          installment={installmentToPay}
          onClose={() => setInstallmentToPay(null)}
          onPaid={handleInstallmentPaid}
        />
      )}
      {installmentToEdit && (
        <InstallmentFormModal
          installment={installmentToEdit}
          sale={sale}
          editPlan
          onClose={() => setInstallmentToEdit(null)}
          onSaved={handleInstallmentPlanUpdated}
        />
      )}
      {installmentToDelete && (
        <ConfirmDialog
          title={`Eliminar cuota ${installmentToDelete.number}`}
          message="Las cuotas posteriores se renumeraran y el plan de la venta se actualizara. Las cuotas pagadas permanecen protegidas."
          loading={deleting}
          onCancel={() => setInstallmentToDelete(null)}
          onConfirm={handleDeleteInstallment}
        />
      )}
    </>
  );
}

export default SaleDetailModal;
