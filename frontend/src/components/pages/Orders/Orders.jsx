import { useEffect, useState } from "react";
import { getMyOrders } from "../../../services/order.service";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Cargando órdenes...</h2>;
  }

return (
  <section className="orders">
    <h1>Mis órdenes</h1>

    {orders.length === 0 ? (
      <p>No tenés compras realizadas.</p>
    ) : (
      orders.map((order) => (
        <article className="order-card" key={order.id}>
          <h2>Orden #{order.id}</h2>

          <p>
            <strong>Estado:</strong> {order.status}
          </p>

          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString("es-AR")}
          </p>

          <p>
            <strong>Total:</strong> ${order.total.toLocaleString()}
          </p>

          <h3>Productos</h3>

          <ul>
            {order.items.map((item) => (
              <li key={item.product}>
                <strong>{item.title}</strong>

                <br />

                Cantidad: {item.quantity}

                <br />

                Precio: ${item.price.toLocaleString()}

                <br />

                Subtotal: ${item.subtotal.toLocaleString()}
              </li>
            ))}
          </ul>

          <h3>Datos de envío</h3>

          <p>
            {order.shipping.full_name}
          </p>

          <p>
            {order.shipping.address}
          </p>

          <p>
            {order.shipping.city}, {order.shipping.province}
          </p>

          <p>
            CP: {order.shipping.zip_code}
          </p>

          <p>
            Tel: {order.shipping.phone}
          </p>

          {order.shipping.notes && (
            <p>
              <strong>Notas:</strong> {order.shipping.notes}
            </p>
          )}
        </article>
      ))
    )}
  </section>
);
}

export default Orders;