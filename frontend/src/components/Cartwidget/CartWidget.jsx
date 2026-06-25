import './CartWidget.css';
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

function CartWidget() {
  const { totalItems } = useCart();

  return (
    <div className="cart-widget">
      <FaShoppingCart className="cart-btn" />
      {totalItems > 0 && (
        <span className="cart-count">{totalItems}</span>
      )}
    </div>
  );
}

export default CartWidget;