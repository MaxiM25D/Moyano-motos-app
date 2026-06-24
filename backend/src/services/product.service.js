import { ProductRepository } from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

export class ProductService {
  getProducts(filter) {
    return productRepository.getProducts(filter);
  }

  getProductById(id) {
    return productRepository.getProductById(id);
  }

  createProduct(data) {
    return productRepository.createProduct(data);
  }

  updateProduct(id, data) {
    return productRepository.updateProduct(id, data);
  }

  deleteProduct(id) {
    return productRepository.deleteProduct(id);
  }
}
