import { CartManager } from "../managers/cart.manager.js";
import { User } from "../models/user.model.js";

const cartManager = new CartManager();

export const createCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Buscar usuario real
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    // 2️⃣ Verificar si ya tiene carrito válido
    if (user.cart) {
      const existingCart = await Cart.findById(user.cart);

      if (existingCart) {
        return res.status(400).json({
          message: "El usuario ya tiene carrito"
        });
      }
      // ⚠️ Si el carrito no existe (porque lo borraste manualmente),
      // dejamos que cree uno nuevo
    }

    // 3️⃣ Crear nuevo carrito
    const newCart = await Cart.create({
      user: userId,
      items: []
    });

    // 4️⃣ Vincular carrito al usuario
    user.cart = newCart._id;
    await user.save();

    res.status(201).json({
      message: "Carrito creado con éxito",
      cart: newCart
    });

  } catch (error) {
    console.error("CREATE CART ERROR:", error);
    res.status(500).json({
      error: error.message
    });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartManager.getById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json({message: "Carrito por ID obtenido con exito!", cart});
  } catch (error) {
    res.status(500).json({ error: "ID inválido" || error.message });
  }
};

export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartManager.getByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.pid;

    const cart = await cartManager.getByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const updatedCart = await cartManager.addProduct(
      cart._id,
      productId
    );

    res.json({
      message: "Producto agregado con éxito",
      cart: updatedCart
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const mergeGuestCart = async (req, res) => {
  try {
    // 1️⃣ Validar que exista body
    if (!req.body) {
      return res.status(400).json({
        error: "El body está vacío o no se está enviando como JSON"
      });
    }

    // 2️⃣ Validar estructura
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        error: "products debe ser un array"
      });
    }

    // 3️⃣ Validar usuario autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: "Usuario no autenticado correctamente"
      });
    }

    // 4️⃣ Buscar usuario real en DB (no confiar solo en el token)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    // 5️⃣ Ejecutar merge (pasamos USER ID, no cartId)
    const updatedCart = await cartManager.mergeCarts(
      user._id,
      products
    );

    return res.status(200).json({
      message: "Carritos combinados con éxito",
      updatedCart
    });

  } catch (error) {
    console.error("MERGE ERROR:", error);
    return res.status(500).json({
      error: "Error interno al combinar carritos",
      detail: error.message
    });
  }
};

export const checkoutCart = async (req, res) => {
  try {

    const userFromToken = req.user;

    const user = await User.findById(userFromToken.id);

    if (!user || !user.cart) {
      return res.status(400).json({
        error: "Usuario sin carrito"
      });
    }

    const result = await cartManager.checkout(user.cart);

    res.json({
      message: "Compra realizada con éxito",
      order: result
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

