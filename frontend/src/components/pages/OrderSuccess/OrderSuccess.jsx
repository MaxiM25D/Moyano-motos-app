import { Link, useLocation, Navigate } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {

    const { state } = useLocation();

    // Si el usuario entra manualmente a la URL
    if (!state?.order) {
        return <Navigate to="/" replace />;
    }

    const { order } = state;

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

                    <Link to="/my-orders">
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