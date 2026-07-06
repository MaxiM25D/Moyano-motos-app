import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../../services/order.service";
import "./Checkout.css";

function Checkout() {
  const { cart, cartId, totalPrice } = useCart();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip_code: "",
    notes: "",
  });

  const handleChange = (e) => {
    setShipping((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await createOrder({
      cartId,
      shipping,
    });

   /*  alert("¡Compra realizada con éxito!"); */

    console.log(response);

    navigate(`/order-success/${response.order.id}`);

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "No se pudo completar la compra."
    );
  }
};

  return (
    <section className="checkout">

      <h1>Checkout</h1>

      <div className="checkout-products">
        <h2>Productos</h2>

        {cart.map((item) => (
          <div key={item.product.id} className="checkout-product">

            <span>{item.product.title}</span>

            <span>
              {item.quantity} × ${item.product.price}
            </span>

          </div>
        ))}

        <h3>Total: ${totalPrice.toLocaleString()}</h3>

      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="full_name"
          placeholder="Nombre completo"
          value={shipping.full_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={shipping.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={shipping.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          value={shipping.city}
          onChange={handleChange}
        />

        <input
          type="text"
          name="province"
          placeholder="Provincia"
          value={shipping.province}
          onChange={handleChange}
        />

        <input
          type="text"
          name="zip_code"
          placeholder="Código Postal"
          value={shipping.zip_code}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notas (opcional)"
          value={shipping.notes}
          onChange={handleChange}
        />

        <button type="submit">
          Confirmar compra
        </button>

      </form>

    </section>
  );
}

export default Checkout;