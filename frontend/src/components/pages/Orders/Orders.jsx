import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiPackage } from "react-icons/fi";
import { getMyOrders } from "../../../services/order.service";
import "./Orders.css";

const statusLabels = {
  pending: "Pendiente",
  paid: "Pagada",
  shipped: "En camino",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyOrders();
      setOrders(data.orders ?? []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        requestError.response?.data?.error ||
        "No pudimos cargar tus compras."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <p className="orders-state">Cargando tus compras...</p>;
  }

  return (
    <section className="orders">
      <header className="orders-header">
        <div>
          <p className="orders-eyebrow">Historial de compras</p>
          <h1>Mis ordenes</h1>
        </div>
        {!error && orders.length > 0 && (
          <span className="orders-count">{orders.length} {orders.length === 1 ? "compra" : "compras"}</span>
        )}
      </header>

      {error && (
        <div className="orders-state orders-error">
          <p>{error}</p>
          <button type="button" onClick={loadOrders}>Reintentar</button>
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="orders-state orders-empty">
          <FiPackage aria-hidden="true" />
          <h2>Todavia no realizaste compras</h2>
          <Link to="/productos">Ver productos</Link>
        </div>
      )}

      {!error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => {
            const firstItem = order.items[0];
            const extraItems = order.items.length - 1;

            return (
              <article className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <time dateTime={order.createdAt}>
                      {new Date(order.createdAt).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <p>Orden #{order.id}</p>
                  </div>
                  <span className={`order-status order-status-${order.status}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="order-product-summary">
                    <FiPackage aria-hidden="true" />
                    <div>
                      <h2>{firstItem?.title ?? "Compra LUNEK"}</h2>
                      <p>
                        {firstItem?.quantity ?? 0} {firstItem?.quantity === 1 ? "unidad" : "unidades"}
                        {extraItems > 0 && ` y ${extraItems} ${extraItems === 1 ? "producto mas" : "productos mas"}`}
                      </p>
                    </div>
                  </div>

                  <div className="order-total">
                    <span>Total</span>
                    <strong>${order.total.toLocaleString("es-AR")}</strong>
                  </div>

                  <Link className="order-detail-link" to={`/orders/${order.id}`} aria-label={`Ver orden ${order.id}`}>
                    Ver detalle
                    <FiChevronRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Orders;
