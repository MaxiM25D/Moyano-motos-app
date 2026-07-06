import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPackage, FiPhone } from "react-icons/fi";
import { getOrderById } from "../../../services/order.service";
import "./OrderDetail.css";

const statusLabels = {
  pending: "Pendiente",
  paid: "Pagada",
  shipped: "En camino",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "No se pudo cargar la orden."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) return <p className="order-detail-state">Cargando orden...</p>;

  if (error) {
    return (
      <div className="order-detail-state">
        <p>{error}</p>
        <Link to="/orders">Volver a mis ordenes</Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <section className="order-detail">
      <Link className="order-detail-back" to="/orders">
        <FiArrowLeft aria-hidden="true" />
        Volver a mis ordenes
      </Link>

      <header className="order-detail-header">
        <div>
          <p>Compra del {new Date(order.createdAt).toLocaleDateString("es-AR")}</p>
          <h1>Detalle de la orden</h1>
          <span>#{order.id}</span>
        </div>
        <span className={`order-detail-status order-detail-status-${order.status}`}>
          {statusLabels[order.status] ?? order.status}
        </span>
      </header>

      <div className="order-detail-layout">
        <div className="order-detail-main">
          <article className="order-detail-section">
            <h2><FiPackage aria-hidden="true" /> Productos</h2>
            <div className="order-detail-products">
              {order.items.map((item) => {
                const product = typeof item.product === "object" ? item.product : null;
                const productId = product?._id ?? product?.id ?? item.product;

                return (
                  <div className="order-detail-product" key={productId}>
                    <div className="order-detail-product-image">
                      {product?.images?.[0] ? (
                        <img src={product.images[0]} alt={item.title} />
                      ) : (
                        <FiPackage aria-hidden="true" />
                      )}
                    </div>
                    <div className="order-detail-product-info">
                      <h3>{item.title}</h3>
                      <p>{item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}</p>
                    </div>
                    <div className="order-detail-product-price">
                      <span>${item.price.toLocaleString("es-AR")} c/u</span>
                      <strong>${item.subtotal.toLocaleString("es-AR")}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="order-detail-section">
            <h2><FiMapPin aria-hidden="true" /> Datos de envio</h2>
            <div className="order-shipping">
              <div>
                <strong>{order.shipping.full_name}</strong>
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}, {order.shipping.province} ({order.shipping.zip_code})</p>
              </div>
              <p className="order-shipping-phone"><FiPhone aria-hidden="true" /> {order.shipping.phone}</p>
            </div>
            {order.shipping.notes && <p className="order-shipping-notes">Notas: {order.shipping.notes}</p>}
          </article>
        </div>

        <aside className="order-detail-summary">
          <h2>Resumen</h2>
          <div>
            <span>Productos</span>
            <span>{order.items.reduce((total, item) => total + item.quantity, 0)}</span>
          </div>
          <div className="order-detail-summary-total">
            <strong>Total</strong>
            <strong>${order.total.toLocaleString("es-AR")}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default OrderDetail;
