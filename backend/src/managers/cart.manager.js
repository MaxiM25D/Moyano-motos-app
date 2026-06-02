import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export class CartManager {

  async create(userId) {
  return await Cart.create({
    user: userId,
    items: []
  });
}

  async getById(id) {
  return await Cart.findById(id).populate("items.product");
  }
  
  async getByUserId(userId) {
  return await Cart.findOne({ user: userId }).populate("items.product");
}

  // Método para agregar un producto al carrito
  async addProduct(cartId, productId) {

    // Verifico que el producto exista
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    //verifica que el producto tenga stock disponible
    if (product.stock <= 0) {
    throw new Error("Producto sin stock disponible");
    }
    // Busco el carrito
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    // Busco si el producto ya está en el carrito
    const existingProduct = cart.items.find(
    p => p.product.toString() === productId
  );


    if (existingProduct) {
    if (existingProduct.quantity + 1 > product.stock) {
      throw new Error("Stock insuficiente");
    }
    existingProduct.quantity += 1;
    } else {
    cart.items.push({
      product: productId,
      quantity: 1
    });
    }
    await cart.save();

    return await Cart.findById(cart._id).populate("items.product");
  }

  // Método para fusionar el carrito del usuario con los productos del carrito de invitado
 async mergeCarts(userCartId, guestItems) {

  if (!userCartId) {
    throw new Error("userCartId es undefined");
  }

  if (!Array.isArray(guestItems)) {
    throw new Error("guestItems debe ser un array");
  }

  const cart = await Cart.findOne({ user: userCartId });

  if (!cart) {
    throw new Error("Carrito no encontrado");
  }

  for (const guestItem of guestItems) {

    const product = await Product.findById(guestItem.product);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const existingProduct = cart.items.find(
      p => p.product.toString() === guestItem.product
    );

    const totalQuantity = existingProduct
      ? existingProduct.quantity + guestItem.quantity
      : guestItem.quantity;

    // 🔥 VALIDACIÓN DE STOCK
    if (totalQuantity > product.stock) {
      throw new Error(
        `No hay suficiente stock para ${product.title}. Disponible: ${product.stock}`
      );
    }

    if (existingProduct) {
      existingProduct.quantity = totalQuantity;
    } else {
      cart.items.push({
        product: guestItem.product,
        quantity: guestItem.quantity
      });
    }
  }

  await cart.save();

  return await Cart.findById(cart._id).populate("items.product");
}

  async checkout(cartId) {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const cart = await Cart.findById(cartId)
      .populate("items.product")
      .session(session);

    console.log("CART:", cart);
    console.log("ITEMS:", cart?.items);

    if (!cart || cart.items.length === 0) {
      throw new Error("Carrito vacío");
    }

    // 1️⃣ Verificar stock
    for (const item of cart.items) {

      const product = await Product.findById(item.product._id).session(session);

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.title}`);
      }
    }

    // 2️⃣ Descontar stock
    for (const item of cart.items) {

      await Product.updateOne(
        { _id: item.product._id },
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // 3️⃣ Vaciar carrito
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true };

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    throw error;
  }
}
}