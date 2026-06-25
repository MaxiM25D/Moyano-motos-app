export class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.user = cart.user;
    this.items = (cart.products ?? []).map((p) => ({
      product: {
        id:    p.product._id,
        title: p.product.title,
        price: p.product.price,
      },
      quantity: p.quantity,
    }));
  }
}
