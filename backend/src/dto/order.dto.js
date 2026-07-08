export class OrderDTO {
  constructor(order) {
    this.id         = order._id.toString();
    this.user       = order.user;
    this.items      = order.items.map((i) => {
      const populatedProduct = i.product?.title
        ? {
            id: i.product._id.toString(),
            title: i.product.title,
            images: i.product.images ?? []
          }
        : i.product?.toString();

      return {
        product:  populatedProduct,
        title:    i.title,
        price:    i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity
      };
    });
    this.shipping   = order.shipping;
    this.total      = order.total;
    this.status     = order.status;
    this.payment    = {
      provider:      order.payment?.provider ?? "mercadopago",
      preference_id: order.payment?.preference_id ?? null,
      payment_id:    order.payment?.payment_id ?? order.payment_id ?? null,
      status:        order.payment?.status ?? "pending",
      status_detail: order.payment?.status_detail ?? null,
      updated_at:    order.payment?.updated_at ?? null
    };
    this.stock_status = order.stock_status ?? "reserved";
    this.stock_expires_at = order.stock_expires_at ?? null;
    this.createdAt  = order.createdAt;
  }
}
