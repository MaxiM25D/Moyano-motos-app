import { Link } from "react-router-dom";
import "./Item.css";

function Item({ product }) {
  return (
    <div className="product-card">
      <Link to={`/producto/${product.id}`}>
        <img
          src={product.images?.[0] ?? "/placeholder.jpg"}
          alt={product.title}
          className="product-image"
        />
      </Link>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">${product.price}</p>
      <Link to={`/producto/${product.id}`} className="btn-detail">
        Ver Detalle
      </Link>
    </div>
  );
}

export default Item;