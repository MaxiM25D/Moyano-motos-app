import { useCart } from "../../../context/CartContext";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <section className="cart">
        <h1 className="cart-title">TU CARRITO</h1>
        <div className="cart-empty">
          <p>Tu carrito está vacío</p>
          <Link to="/productos" className="btn-seguir-comprando">
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart">
      <h1 className="cart-title">TU CARRITO</h1>

      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.product.id} className="cart-item">
            <img
              src={item.product.images?.[0] ?? "/placeholder.jpg"}
              alt={item.product.title}
              className="cart-item-img"
            />

            <div className="cart-item-info">
              <h3 className="cart-item-title">{item.product.title}</h3>
              <p className="cart-item-price">${item.product.price}</p>
            </div>

            <div className="cart-item-quantity">
              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
            </div>

            <p className="cart-item-subtotal">
              ${(item.product.price * item.quantity).toLocaleString()}
            </p>

            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(item.product.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <div className="cart-summary">
          <span>{totalItems} {totalItems === 1 ? "producto" : "productos"}</span>
          <span className="cart-total">Total: ${totalPrice.toLocaleString()}</span>
        </div>

        <div className="cart-actions">
          <Link to="/productos" className="btn-seguir-comprando">
            Seguir comprando
          </Link>
          <Link to="/checkout" className="btn-checkout">
            Finalizar compra
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Cart;