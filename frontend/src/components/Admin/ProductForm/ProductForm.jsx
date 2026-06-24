import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "../../../services/productService";
import { uploadImage } from "../../../services/cloudinary.service.js";
import "./ProductForm.css";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  subcategory: "",
  type: "",
  brand: "LUNEK",
  tags: "",
  isFeatured: false,
  isActive: true,
  images: [],
};

function ProductForm() {
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      const p = data.product;
      setForm({
        title: p.title,
        slug: p.slug,
        description: p.description ?? "",
        price: p.price,
        stock: p.stock,
        category: p.category,
        subcategory: p.subcategory,
        type: p.type ?? "",
        brand: p.brand ?? "LUNEK",
        tags: p.tags?.join(", ") ?? "",
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        images: p.images ?? [],
      });
      setPreviews(p.images ?? []);
    } catch (err) {
      setError("Error cargando el producto");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let images = form.images;

      // Si hay imágenes nuevas, subirlas a Cloudinary
      if (imageFiles.length > 0) {
        images = await Promise.all(imageFiles.map((f) => uploadImage(f)));
      }

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        images,
      };

      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/products");
    } catch (err) {
      setError("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2 className="product-form-title">
        {isEditing ? "Editar producto" : "Nuevo producto"}
      </h2>

      {error && <p className="form-error">{error}</p>}

      <form className="product-form" onSubmit={handleSubmit}>

        <div className="form-row">
          <div className="form-group">
            <label>Título *</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Stock *</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Categoría *</label>
            <input name="category" value={form.category} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Subcategoría *</label>
            <input name="subcategory" value={form.subcategory} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <input name="type" value={form.type} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Marca</label>
            <input name="brand" value={form.brand} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Tags (separados por coma)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="acero, dorado, minimal" />
          </div>
        </div>

        <div className="form-row form-checkboxes">
          <label className="form-checkbox">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
            Destacado
          </label>
          <label className="form-checkbox">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            Activo
          </label>
        </div>

        <div className="form-group">
          <label>Imágenes</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          {previews.length > 0 && (
            <div className="image-previews">
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} className="preview-img" />
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/admin/products")}>
            Cancelar
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProductForm;
