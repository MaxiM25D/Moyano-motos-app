import { useContext } from "react";
import { CartContext } from "../CartContext/CartContext";
import ItemCount from "../ItemCount/ItemCount";
import "./ItemDetail.css";

function ItemDetail({ item }) {
  const { addItemToCart } = useContext(CartContext);

  if (!item) return <p>Producto no encontrado</p>;

  const handleAdd = (cantidad) => {
    // validaciones
    const qty = Number(cantidad);
    if (isNaN(qty) || qty <= 0) return;
    addItemToCart(item, qty);
    /* window.alert(`${qty} x ${item.nombre} agregado al carrito`); */
  };

  return (
    <div className="container-detail">
      <h2 className="title">{item.nombre || "Producto"}</h2>
      <img src={item.img} alt={item.nombre || "Producto"} className="img-detail" />
      <p className="precio">Precio: ${Number(item.precio).toLocaleString()}</p>
      <p className="categoria">Categoría: {item.categoria}</p>
      <ItemCount stock={10} initial={1} onAdd={handleAdd} />
    </div>
  );
}

export default ItemDetail;