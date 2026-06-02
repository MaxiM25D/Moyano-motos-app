import { UserManager } from "../managers/user.manager.js";
import { createHash } from "../utils/bcrypt.js";
import { Cart } from "../models/cart.model.js";

const userManager = new UserManager();


// REGISTER
export const registerUser = async (req, res) => {
  try {

    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password || !age) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existingUser = await userManager.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = createHash(password);

    // 1️⃣ Crear usuario SIN carrito todavía
    const newUser = await userManager.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age
    });

    // 2️⃣ Crear carrito asociado al usuario
    const newCart = await Cart.create({
      user: newUser._id,
      items: []
    });

    // 3️⃣ Guardar el carrito en el usuario
    newUser.cart = newCart._id;
    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CURRENT
export const currentUser = async (req, res) => {
  res.json({
    user: req.user
  });
};