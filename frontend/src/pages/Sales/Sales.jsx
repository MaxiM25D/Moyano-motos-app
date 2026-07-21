import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEye, FiFileText, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import SaleDetailModal from "../../components/sales/SaleDetailModal.jsx";
import SaleFormModal from "../../components/sales/SaleFormModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { deleteSale, getSales } from "../../services/saleService.js";
import "./Sales.css";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

const date = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

const statusLabels = {
  ACTIVE: "Activa",
  PAID: "Pagada",
  CANCELLED: "Cancelada"
};

function Sales() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const canCreate = ["ADMIN", "SELLER"].includes(user.role);
  const canDelete = user.role === "ADMIN";

  const loadSales = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSales(await getSales());
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar las ventas"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const filteredSales = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sales;

    return sales.filter((sale) => [
      sale.id,
      sale.saleNumber,
      sale.client?.name,
      sale.client?.dni,
      sale.motorcycle?.brand,
      sale.motorcycle?.model,
      sale.motorcycle?.domain
    ].some((value) => String(value || "").toLowerCase().includes(term)));
  }, [sales, search]);

  const soldMotorcycleIds = useMemo(
    () => new Set(sales.map((sale) => sale.motorcycleId)),
    [sales]
  );

  const handleCreated = async (sale) => {
    setCreateOpen(false);
    setNotice(`La venta #${sale.saleNumber} fue registrada con ${sale.installmentPlan} cuotas.`);
    await loadSales();
    setSelectedSale(sale);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const deleted = await deleteSale(saleToDelete.id);
      setSaleToDelete(null);
      setSelectedSale((current) => current?.id === deleted.id ? null : current);
      setNotice(`La venta #${deleted.saleNumber} fue eliminada.`);
      await loadSales();
    } catch (requestError) {
      setSaleToDelete(null);
      setError(getApiError(requestError, "No se pudo eliminar la venta"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="sales-page">
      <header className="sales-header">
        <div><p>Financiacion</p><h1>Ventas</h1><span>Operaciones registradas y sus planes de cuotas.</span></div>
        {canCreate && <button className="primary-button new-sale-button" onClick={() => setCreateOpen(true)}><FiPlus />Nueva venta</button>}
      </header>

      {notice && <div className="sales-success-notice" role="status">{notice}</div>}
      {error && <div className="sales-error" role="alert">{error}<button onClick={loadSales}>Reintentar</button></div>}

      <div className="sales-toolbar">
        <div className="sales-search">
          <FiSearch />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por cliente, DNI, moto o dominio" aria-label="Buscar ventas" />
          {search && <button onClick={() => setSearch("")} aria-label="Limpiar busqueda" title="Limpiar busqueda"><FiX /></button>}
        </div>
        <span>{loading ? "Cargando..." : `${filteredSales.length} ${filteredSales.length === 1 ? "venta" : "ventas"}`}</span>
      </div>

      <div className="sales-table-wrap">
        {loading ? (
          <div className="sales-loading"><span /><span /><span /><span /></div>
        ) : filteredSales.length ? (
          <table className="sales-table">
            <thead><tr><th>Venta</th><th>Cliente</th><th>Moto</th><th>Fecha</th><th>Plan</th><th>Financiado</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead>
            <tbody>
              {filteredSales.map((sale) => {
                const paid = sale.installments.filter((item) => item.status === "PAID").length;
                return (
                  <tr key={sale.id}>
                    <td data-label="Venta"><strong>#{sale.saleNumber}</strong></td>
                    <td data-label="Cliente"><div className="sale-client"><strong>{sale.client?.name || "-"}</strong><small>DNI {sale.client?.dni || "-"}</small></div></td>
                    <td data-label="Moto"><div className="sale-motorcycle"><strong>{sale.motorcycle?.brand} {sale.motorcycle?.model}</strong><small>{sale.motorcycle?.domain || "Sin dominio"}</small></div></td>
                    <td data-label="Fecha">{date.format(new Date(sale.saleDate))}</td>
                    <td data-label="Plan"><strong>{sale.installmentPlan}</strong> cuotas<small className="paid-progress">{paid} pagadas</small></td>
                    <td data-label="Financiado" className="sale-money">
                      {money.format(Number(sale.totalFinancedAmount || sale.financedAmount))}
                      {Number(sale.financingInterestRate || 0) > 0 && <small>Incluye {sale.financingInterestRate}% de interes</small>}
                    </td>
                    <td data-label="Estado"><span className={`sale-status ${sale.status.toLowerCase()}`}>{statusLabels[sale.status]}</span></td>
                    <td className="sale-action-cell"><div className="sale-row-actions"><button onClick={() => setSelectedSale(sale)} aria-label={`Ver venta ${sale.saleNumber}`} title="Ver detalle"><FiEye /></button>{canDelete && <button className="sale-delete-button" onClick={() => setSaleToDelete(sale)} aria-label={`Eliminar venta ${sale.saleNumber}`} title="Eliminar venta"><FiTrash2 /></button>}</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="sales-empty"><FiFileText /><strong>{search ? "No encontramos coincidencias" : "Todavia no hay ventas"}</strong><span>{search ? "Proba con otro cliente, DNI o moto." : "Las operaciones financiadas apareceran en esta lista."}</span>{!search && canCreate && <button className="primary-button" onClick={() => setCreateOpen(true)}><FiPlus />Registrar venta</button>}</div>
        )}
      </div>

      {createOpen && <SaleFormModal soldMotorcycleIds={soldMotorcycleIds} onClose={() => setCreateOpen(false)} onSaved={handleCreated} />}
      {selectedSale && <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />}
      {saleToDelete && <ConfirmDialog title={`Eliminar venta #${saleToDelete.saleNumber}`} message="Se eliminaran la venta, sus cuotas, pagos y recibos relacionados. Esta accion no se puede deshacer." loading={deleting} onCancel={() => setSaleToDelete(null)} onConfirm={handleDelete} />}
    </section>
  );
}

export default Sales;
