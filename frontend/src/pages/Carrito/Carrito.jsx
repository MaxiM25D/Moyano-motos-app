import { useContext, useState } from "react";
import { CartContext } from "../../components/CartContext/CartContext";
import { db } from "../../data/firebaseConfig.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "./Carrito.css";


function Carrito({ greeting }) {
  const { items, totalPrice, removeItemFromCart, clearCart } = useContext(CartContext);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const finalizarCompra = async () => {
    if (items.length === 0) return;
    if (!form.nombre || !form.email || !form.telefono) {
      alert("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);

    const orden = {
      comprador: { ...form },
      items: items.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      total: totalPrice,
      fecha: Timestamp.fromDate(new Date()),
    };

    try {
      const ordenesRef = collection(db, "ordenes");
      const doc = await addDoc(ordenesRef, orden);
      setOrderId(doc.id);
      clearCart();
    } catch (error) {
      console.error("Error al generar la orden:", error);
    } finally {
      setLoading(false);
    }
  };

  // Si ya hay orden generada
  if (orderId) {
    return (
      <section className="carrito">
        <h1 className="carrito-title">✅¡Gracias por tu compra!✅</h1>
        <p className="carrito-order-id">
          Tu número de orden es: <strong>"{orderId}"</strong>
        </p>
        
      </section>
    );
  }

  return (
    <section className="carrito">
      <h1 className="carrito-title">{ greeting }</h1>

      {(!items || items.length === 0) ? (
        <p className="carrito-empty">Tu carrito está vacío</p>
      ) : (
        <>
          <ul className="carrito-list">
            {items.map((prod) => (
              <li key={String(prod.id)} className="carrito-item">
                <div className="item-container">
                  <img className ="item-img" src={prod.img} alt={prod.nombre} width="50" height="50" />
                  <span className="item-nombre">{prod.nombre || "Sin nombre"}</span>
                  <span className="cantidad"> (x{Number(prod.cantidad) || 0})</span>
                </div>

                <div className="item-precio-container">
                  <span className="item-precio">
                    ${ (Number(prod.precio || 0) * Number(prod.cantidad || 0)).toLocaleString() }
                  </span>
                  <button onClick={() => removeItemFromCart(prod.id)} className="btn-remove">
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="carrito-footer">
            <h2 className="carrito-total">Total: ${Number(totalPrice).toLocaleString()}</h2>
            <button onClick={clearCart} className="btn-clear">VACIAR CARRITO 🗑️</button>
          </div>

          {/* FORMULARIO DE CHECKOUT */}
          <div className="checkout-form">
            <h3>Completa tus datos para finalizar la compra:</h3>
            <form>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </form>
            <button onClick={finalizarCompra} className="btn-buy" disabled={loading}>
              {loading ? "Procesando..." : "FINALIZAR COMPRA"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Carrito;