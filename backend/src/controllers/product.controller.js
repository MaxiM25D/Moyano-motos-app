import { ProductManager } from "../managers/product.manager.js";
import { productSchema } from "../validators/product.validator.js";


const productManager = new ProductManager();

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      category,
      subcategory,
      type,
      sort,
      search,
      featured
    } = req.query;

    const result = await productManager.getAdvanced({
      page: Number(page),
      limit: Number(limit),
      category,
      subcategory,
      type,
      sort,
      search,
      featured
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message || "Error getting products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productManager.getById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found"  });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message  || "Error getting product"});
  }
};

export const createProduct = async (req, res) => {
  try {
    
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const newProduct = await productManager.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message  || "Error creating product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await productManager.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message  || "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await productManager.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado con exito!" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error deleting product" });
  }
};