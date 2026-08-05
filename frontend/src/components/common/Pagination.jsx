import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Pagination.css";

function Pagination({ pagination, onPageChange, label = "registros" }) {
  const { page = 1, pageSize = 20, total = 0, totalPages = 1 } = pagination || {};
  if (!total) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav className="pagination" aria-label={`Paginación de ${label}`}>
      <span>Mostrando {first}-{last} de {total}</span>
      <div>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          title="Página anterior"
        >
          <FiChevronLeft />
        </button>
        <strong>Página {page} de {totalPages}</strong>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Página siguiente"
          title="Página siguiente"
        >
          <FiChevronRight />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
