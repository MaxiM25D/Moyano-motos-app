export class CartDTO {
  constructor(cart) {
    this.id = cart._id.toString();
    this.user = cart.user.toString();
    this.products = (cart.products ?? []).map((p) => ({
      product: {
        id:    p.product._id.toString(),
        title: p.product.title,
        price: p.product.price,
        stock: p.product.stock,
        images: p.product.images,
      },
      quantity: p.quantity,
    }));
  }
}
