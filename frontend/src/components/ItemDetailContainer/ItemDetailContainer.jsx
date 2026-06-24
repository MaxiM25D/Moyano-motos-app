import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
<<<<<<< HEAD
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import "./ItemDetailContainer.css";

function ItemDetailContainer() {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
=======
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../data/firebaseConfig";
import ItemDetail from "../ItemDetail/ItemDetail";

function ItemDetailContainer() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f
  const { id } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
<<<<<<< HEAD
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data.product); // ← el backend devuelve { product: {} }
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
=======
    const fetchProducto = async () => {
      try {
        const productosRef = collection(db, "productos");

        // Buscamos por el campo "id" que cargaste dentro del documento
        const q = query(productosRef, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          setItem(null);
        }
      } catch (error) {
        console.error("Error obteniendo producto:", error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <p>⌛ Cargando...</p>;
  if (!item) return <p>Producto no encontrado</p>;

  return <ItemDetail item={item} />;
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f
}

export default ItemDetailContainer;