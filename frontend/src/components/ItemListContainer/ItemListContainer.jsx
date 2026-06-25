import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { useParams } from "react-router-dom";
import ItemList from "../ItemList/ItemList";
import "./ItemListContainer.css";

function ItemListContainer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category, subcategory } = useParams();

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ category, subcategory });
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Cargando productos...</p>;
  if (products.length === 0) return <p className="loading">No hay productos en esta categoria.</p>;

  return (
    <div className="itemlist-container">
      <ItemList products={products} />
    </div>
  );
}

export default ItemListContainer;
