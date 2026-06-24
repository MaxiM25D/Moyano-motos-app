import { useEffect, useState } from "react";
<<<<<<< HEAD
import { getProducts } from "../../services/productService";
import { useParams } from "react-router-dom";
=======
import { collection, getDocs, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../data/firebaseConfig";
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f
import ItemList from "../ItemList/ItemList";
import "./ItemListContainer.css";

function ItemListContainer() {
<<<<<<< HEAD
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
      setProducts(data.products); // ← el backend devuelve { products: [] }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Cargando productos...</p>;
  if (products.length === 0) return <p className="loading">No hay productos en esta categoría.</p>;

  return (
    <div className="itemlist-container">
      <ItemList products={products} />
    </div>
=======
  const [productos, setProductos] = useState([]);
  const { categoriaId } = useParams();

  useEffect(() => {
    const productosRef = collection(db, "productos");

    const q = categoriaId
      ? query(productosRef, where("categoria", "==", categoriaId))
      : productosRef;

    getDocs(q).then((resp) => {
      setProductos(
        resp.docs.map((doc) => {
          return { ...doc.data()};
        })
      );
    });
  }, [categoriaId]);

  return (
    <section className="item-list-container">
      <h2 className="title-list-container">
        {categoriaId 
        ? `PRODUCTOS DE ${categoriaId.toUpperCase()}` 
        : "TODOS LOS PRODUCTOS"}
      </h2>
      <ItemList productos={productos} />
    </section>
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f
  );
}

export default ItemListContainer;
