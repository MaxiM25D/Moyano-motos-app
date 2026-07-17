import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiShoppingBag, FiTrash2, FiX } from "react-icons/fi";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import MotorcycleFormModal from "../../components/motorcycles/MotorcycleFormModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { deleteMotorcycle, getMotorcycles } from "../../services/motorcycleService.js";
import "./Motorcycles.css";

function Motorcycles() {
  const { user } = useAuth();
  const [motorcycles, setMotorcycles] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMotorcycle, setSelectedMotorcycle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [motorcycleToDelete, setMotorcycleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const canManage = ["ADMIN", "SELLER"].includes(user.role);
  const canDelete = user.role === "ADMIN";

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadMotorcycles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setMotorcycles(await getMotorcycles(debouncedSearch));
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar las motos"));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadMotorcycles();
  }, [loadMotorcycles]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const openCreate = () => {
    setSelectedMotorcycle(null);
    setModalOpen(true);
  };

  const openEdit = (motorcycle) => {
    setSelectedMotorcycle(motorcycle);
    setModalOpen(true);
  };

  const handleSaved = async (motorcycle, wasEditing) => {
    setModalOpen(false);
    setSelectedMotorcycle(null);
    setNotice(wasEditing
      ? `${motorcycle.brand} ${motorcycle.model} fue actualizada.`
      : `${motorcycle.brand} ${motorcycle.model} fue registrada.`);
    await loadMotorcycles();
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const deleted = await deleteMotorcycle(motorcycleToDelete.id);
      setMotorcycleToDelete(null);
      setNotice(`${deleted.brand} ${deleted.model} fue eliminada.`);
      await loadMotorcycles();
    } catch (requestError) {
      setMotorcycleToDelete(null);
      setError(getApiError(requestError, "No se pudo eliminar la moto"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="motorcycles-page">
      <header className="motorcycles-header">
        <div>
          <p>Inventario</p>
          <h1>Motos</h1>
          <span>Unidades registradas para venta y financiacion.</span>
        </div>
        {canManage && (
          <button className="primary-button new-motorcycle-button" onClick={openCreate}>
            <FiPlus />
            Nueva moto
          </button>
        )}
      </header>

      {notice && <div className="moto-success-notice" role="status">{notice}</div>}
      {error && <div className="motorcycles-error" role="alert">{error}<button onClick={loadMotorcycles}>Reintentar</button></div>}

      <div className="motorcycles-toolbar">
        <div className="motorcycle-search">
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por marca, modelo, dominio, chasis o motor"
            aria-label="Buscar motos"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Limpiar busqueda" title="Limpiar busqueda"><FiX /></button>
          )}
        </div>
        <span className="motorcycle-count">{loading ? "Cargando..." : `${motorcycles.length} ${motorcycles.length === 1 ? "moto" : "motos"}`}</span>
      </div>

      <div className="motorcycles-table-wrap">
        {loading ? (
          <div className="motorcycles-loading"><span /><span /><span /><span /></div>
        ) : motorcycles.length ? (
          <table className="motorcycles-table">
            <thead>
              <tr>
                <th>Unidad</th>
                <th>Año</th>
                <th>Dominio</th>
                <th>Chasis</th>
                <th>Motor</th>
                <th>Color</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {motorcycles.map((motorcycle) => (
                <tr key={motorcycle.id}>
                  <td data-label="Unidad">
                    <div className="motorcycle-identity">
                      <span><FiShoppingBag /></span>
                      <div><strong>{motorcycle.brand} {motorcycle.model}</strong><small>Unidad #{motorcycle.id}</small></div>
                    </div>
                  </td>
                  <td data-label="Año">{motorcycle.year || "-"}</td>
                  <td data-label="Dominio"><span className={motorcycle.domain ? "domain-badge" : "muted-value"}>{motorcycle.domain || "Sin dominio"}</span></td>
                  <td data-label="Chasis" className="identifier-cell">{motorcycle.chassisNumber || "-"}</td>
                  <td data-label="Motor" className="identifier-cell">{motorcycle.engineNumber || "-"}</td>
                  <td data-label="Color" className="muted-value">{motorcycle.color || "-"}</td>
                  <td className="moto-action-cell">
                    <div className="moto-row-actions">
                    {canManage && (
                      <button className="moto-edit-button" onClick={() => openEdit(motorcycle)} aria-label={`Editar ${motorcycle.brand} ${motorcycle.model}`} title="Editar moto">
                        <FiEdit2 />
                      </button>
                    )}
                    {canDelete && <button className="moto-delete-button" onClick={() => setMotorcycleToDelete(motorcycle)} aria-label={`Eliminar ${motorcycle.brand} ${motorcycle.model}`} title="Eliminar moto"><FiTrash2 /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="motorcycles-empty">
            <FiShoppingBag />
            <strong>{debouncedSearch ? "No encontramos coincidencias" : "Todavia no hay motos"}</strong>
            <span>{debouncedSearch ? "Proba con otra marca, modelo o identificador." : "Las unidades registradas apareceran en esta lista."}</span>
            {!debouncedSearch && canManage && <button className="primary-button" onClick={openCreate}><FiPlus />Registrar moto</button>}
          </div>
        )}
      </div>

      {modalOpen && (
        <MotorcycleFormModal
          motorcycle={selectedMotorcycle}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
      {motorcycleToDelete && <ConfirmDialog title="Eliminar moto" message={`Se eliminara ${motorcycleToDelete.brand} ${motorcycleToDelete.model}. Solo es posible si no tiene una venta asociada.`} loading={deleting} onCancel={() => setMotorcycleToDelete(null)} onConfirm={handleDelete} />}
    </section>
  );
}

export default Motorcycles;
