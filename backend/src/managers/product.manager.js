import { Product } from "../models/product.model.js";

export class ProductManager {

  async getAll() {
    return await Product.find();
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async getPaginated({ page, limit, category }) {

  const filter = category ? { category } : {};

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .limit(limit)
    .skip((page - 1) * limit);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasPrevPage: page > 1,
    hasNextPage: page < Math.ceil(total / limit),
    products
  };
  }

  async getByCategory(category) {
  return await Product.find({ category });
  }
  async create(productData) {
    return await Product.create(productData);
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async getAdvanced({ page, limit, category, sort, search, type, subcategory, featured }) {

  // 🟢 FILTROS
  const filter = {};

// FILTROS DE CATEGORÍA, SUBCATEGORÍA Y TIPO 
  if (category) {
    filter.category = category;
  }
  if (subcategory) {
  filter.subcategory = subcategory;
  }
  if (type) {
  filter.type = type;
  }
  if (featured === "true") {
  filter.isFeatured = true;
}

// BÚSQUEDA
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  // 🟢 ORDENAMIENTO
  let sortOption = {};

  if (sort === "price_asc") {
    sortOption.price = 1;
  }

  if (sort === "price_desc") {
    sortOption.price = -1;
  }

  // 🟢 TOTAL DOCUMENTOS
  const total = await Product.countDocuments(filter);

  // 🟢 CONSULTA
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip((page - 1) * limit);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasPrevPage: page > 1,
    hasNextPage: page < Math.ceil(total / limit),
    products
  };
  }
}