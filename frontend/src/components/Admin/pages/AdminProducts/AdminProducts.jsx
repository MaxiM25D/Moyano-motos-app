import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
} from "../../../../services/productService";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  if (loading) return <p className="admin-loading">Cargando productos...</p>;

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h2>Productos</h2>
        <button
          className="btn-admin-primary"
          onClick={() => navigate("/admin/products/new")}
        >
          + Nuevo producto
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.images?.[0] ?? "/placeholder.jpg"}
                  alt={product.title}
                  className="admin-product-img"
                />
              </td>
              <td>{product.title}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td className="admin-actions">
                <button
                  className="btn-admin-edit"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn-admin-delete"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;
