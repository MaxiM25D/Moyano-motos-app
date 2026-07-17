import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiUser, FiUsers, FiX } from "react-icons/fi";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import ClientFormModal from "../../components/clients/ClientFormModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { deleteClient, getClients } from "../../services/clientService.js";
import "./Clients.css";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

function Clients() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
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

  const loadClients = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setClients(await getClients(debouncedSearch));
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar los clientes"));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const openCreate = () => {
    setSelectedClient(null);
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleSaved = async (client, wasEditing) => {
    setModalOpen(false);
    setSelectedClient(null);
    setNotice(wasEditing ? `${client.name} fue actualizado.` : `${client.name} fue registrado.`);
    await loadClients();
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const deleted = await deleteClient(clientToDelete.id);
      setClientToDelete(null);
      setNotice(`${deleted.name} fue eliminado.`);
      await loadClients();
    } catch (requestError) {
      setClientToDelete(null);
      setError(getApiError(requestError, "No se pudo eliminar el cliente"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="clients-page">
      <header className="clients-header">
        <div>
          <p>Gestion comercial</p>
          <h1>Clientes</h1>
          <span>Personas registradas para ventas y financiacion.</span>
        </div>
        {canManage && (
          <button className="primary-button new-client-button" onClick={openCreate}>
            <FiPlus />
            Nuevo cliente
          </button>
        )}
      </header>

      {notice && <div className="success-notice" role="status">{notice}</div>}
      {error && <div className="clients-error" role="alert">{error}<button onClick={loadClients}>Reintentar</button></div>}

      <div className="clients-toolbar">
        <div className="client-search">
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, DNI o telefono"
            aria-label="Buscar clientes"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Limpiar busqueda" title="Limpiar busqueda"><FiX /></button>
          )}
        </div>
        <span className="client-count">{loading ? "Cargando..." : `${clients.length} ${clients.length === 1 ? "cliente" : "clientes"}`}</span>
      </div>

      <div className="clients-table-wrap">
        {loading ? (
          <div className="clients-loading"><span /><span /><span /><span /></div>
        ) : clients.length ? (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>DNI</th>
                <th>Telefono</th>
                <th>Direccion</th>
                <th>Registro</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td data-label="Cliente">
                    <div className="client-identity">
                      <span>{client.name.charAt(0).toUpperCase()}</span>
                      <div><strong>{client.name}</strong><small>Cliente #{client.id}</small></div>
                    </div>
                  </td>
                  <td data-label="DNI">{client.dni}</td>
                  <td data-label="Telefono">{client.phone}</td>
                  <td data-label="Direccion" className="muted-cell">{client.address || "Sin direccion"}</td>
                  <td data-label="Registro" className="muted-cell">{dateFormatter.format(new Date(client.createdAt))}</td>
                  <td className="action-cell">
                    <div className="row-actions">
                    {canManage && (
                      <button className="edit-button" onClick={() => openEdit(client)} aria-label={`Editar a ${client.name}`} title="Editar cliente">
                        <FiEdit2 />
                      </button>
                    )}
                    {canDelete && <button className="delete-icon-button" onClick={() => setClientToDelete(client)} aria-label={`Eliminar a ${client.name}`} title="Eliminar cliente"><FiTrash2 /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="clients-empty">
            {debouncedSearch ? <FiUser /> : <FiUsers />}
            <strong>{debouncedSearch ? "No encontramos coincidencias" : "Todavia no hay clientes"}</strong>
            <span>{debouncedSearch ? "Proba con otro nombre, DNI o telefono." : "Los clientes registrados apareceran en esta lista."}</span>
            {!debouncedSearch && canManage && <button className="primary-button" onClick={openCreate}><FiPlus />Registrar cliente</button>}
          </div>
        )}
      </div>

      {modalOpen && (
        <ClientFormModal
          client={selectedClient}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
      {clientToDelete && <ConfirmDialog title="Eliminar cliente" message={`Se eliminara a ${clientToDelete.name}. Esta accion no se puede deshacer.`} loading={deleting} onCancel={() => setClientToDelete(null)} onConfirm={handleDelete} />}
    </section>
  );
}

export default Clients;
