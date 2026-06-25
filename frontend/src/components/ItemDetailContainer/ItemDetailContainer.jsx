import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import "./ItemDetailContainer.css";

function ItemDetailContainer() {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data.product);
    } catch (err) {
      setError("Producto no encontrado");
    }
  };

  if (error) return <p className="loading">{error}</p>;
  if (!product) return <p className="loading">Cargando...</p>;

  return (
    <div className="product-detail-container">
      <img
        src={product.images?.[0] ?? "/placeholder.jpg"}
        alt={product.title}
        className="product-detail-image"
      />
      <div className="product-detail-info">
        <h2 className="product-detail-title">{product.title}</h2>
        <p className="product-detail-price">${product.price}</p>
        <p className="product-detail-category">{product.category}</p>
        <p className="product-detail-description">{product.description}</p>
        <button className="btn-add-cart" onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ItemDetailContainer;
