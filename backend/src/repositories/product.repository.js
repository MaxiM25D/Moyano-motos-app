import { ProductDAO } from "../dao/product.dao.js";

const productDAO = new ProductDAO();

export class ProductRepository {
  getProducts(filter) {
    return productDAO.getAll(filter);
  }

  getProductById(id) {
    return productDAO.getById(id);
  }

  createProduct(data) {
    return productDAO.create(data);
  }

  updateProduct(id, data) {
    return productDAO.update(id, data);
  }

  deleteProduct(id) {
    return productDAO.delete(id);
  }
}
