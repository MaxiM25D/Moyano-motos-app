export class ProductDTO {
  constructor(product) {
    this.id          = product._id;
    this.title       = product.title;
    this.slug        = product.slug;
    this.description = product.description;
    this.price       = product.price;
    this.stock       = product.stock;
    this.category    = product.category;
    this.subcategory = product.subcategory;
    this.type        = product.type;
    this.brand       = product.brand;
    this.tags        = product.tags;
    this.images      = product.images;
    this.isFeatured  = product.isFeatured;
    this.isActive    = product.isActive;
  }
}