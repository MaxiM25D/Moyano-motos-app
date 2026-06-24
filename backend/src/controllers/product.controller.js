import { ProductService } from "../services/product.service.js";
import { ProductDTO }     from "../dto/product.dto.js";

const productService = new ProductService();

export const getProducts = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    const products = await productService.getProducts(filter);
    res.json({ message: "Productos obtenidos", products: products.map((p) => new ProductDTO(p)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ product: new ProductDTO(product) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ message: "Producto creado", product: new ProductDTO(product) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", product: new ProductDTO(product) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
