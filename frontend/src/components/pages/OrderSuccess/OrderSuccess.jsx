import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../../../services/order.service";
import "./OrderSuccess.css";

function OrderSuccess() {
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

    if (loading) return <p className="order-success">Cargando orden...</p>;
    if (error) return <p className="order-success">{error}</p>;
    if (!order) return null;

    return (
        <section className="order-success">

            <div className="success-card">

                <h1>✅ ¡Compra realizada con éxito!</h1>

                <p>
                    Gracias por comprar en <strong>LUNEK</strong>.
                </p>

                <hr />

                <p>
                    <strong>Número de orden</strong>
                </p>

                <p className="order-id">
                    {order.id}
                </p>

                <p>
                    <strong>Estado:</strong> {order.status}
                </p>

                <p>
                    <strong>Total:</strong> ${order.total.toLocaleString()}
                </p>

                <div className="success-buttons">

                    <Link to="/orders">
                        Ver mis órdenes
                    </Link>

                    <Link to="/productos">
                        Seguir comprando
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default OrderSuccess;
