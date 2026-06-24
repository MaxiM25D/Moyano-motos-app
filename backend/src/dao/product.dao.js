import { Product } from "../models/product.model.js";

export class ProductDAO {
  getAll(filter = {}) {
    // Limpiamos los valores undefined para que Mongoose no los incluya en el query
    const cleanFilter = Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v !== undefined && v !== null)
    );
    return Product.find(cleanFilter);
  }

  getById(id) {
    return Product.findById(id);
  }

  create(data) {
    return Product.create(data);
  }

  update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return Product.findByIdAndDelete(id);
  }
}
