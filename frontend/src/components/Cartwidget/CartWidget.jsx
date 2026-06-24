<<<<<<< HEAD
import './CartWidget.css';
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function CartWidget() {
  const { totalItems } = useCart();

  return (
    <Link to="/cart" className="cart-widget">
      <FaShoppingCart className="cart-btn" />
      {totalItems > 0 && (
        <span className="cart-count">{totalItems}</span>
      )}
    </Link>
  );
=======
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../CartContext/CartContext";
import { useContext } from "react";
import { Badge } from "antd";
import './CartWidget.css'


function CartWidget() {

  const valorDelContexto = useContext(CartContext)

  return (
    <div className="cart-widget">
      <Badge count={valorDelContexto.totalQuantity} >
        <FaShoppingCart className='cart-btn' />
      </Badge>
    </div>
  )
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f
}

export default CartWidget;