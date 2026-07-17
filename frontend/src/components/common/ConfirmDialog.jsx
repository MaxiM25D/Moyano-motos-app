import { useEffect } from "react";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";
import "./ConfirmDialog.css";

function ConfirmDialog({ title, message, confirmLabel = "Eliminar", loading, onCancel, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading, onCancel]);

  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !loading) onCancel();
    }}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <header>
          <span className="confirm-icon"><FiAlertTriangle /></span>
          <div><h2 id="confirm-title">{title}</h2><p id="confirm-message">{message}</p></div>
          <button type="button" onClick={onCancel} disabled={loading} aria-label="Cerrar" title="Cerrar"><FiX /></button>
        </header>
        <footer>
          <button className="secondary-button" type="button" onClick={onCancel} disabled={loading}>Cancelar</button>
          <button className="danger-button" type="button" onClick={onConfirm} disabled={loading}><FiTrash2 />{loading ? "Eliminando..." : confirmLabel}</button>
        </footer>
      </section>
    </div>
  );
}

export default ConfirmDialog;
