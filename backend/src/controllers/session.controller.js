import { SessionService } from "../services/session.service.js";
import { UserService }    from "../services/user.service.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { UserDTO }        from "../dto/user.dto.js";
import { createHash }     from "../utils/bcrypt.js";

const sessionService = new SessionService();
const userService    = new UserService();
const cartRepository = new CartRepository();

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password || !age)
      return res.status(400).json({ message: "Faltan datos obligatorios" });

    const existing = await userService.getUserByEmail(email);
    if (existing) return res.status(400).json({ message: "El usuario ya existe" });

    const hashedPassword = createHash(password);

    const newUser = await userService.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
    });

    // Ahora sí creás el carrito con el ID del usuario
    const newCart = await cartRepository.createCart(newUser._id);

    // Y actualizás el usuario con el cart
    const userWithCart = await userService.updateUser(newUser._id, { cart: newCart._id });

    res.status(201).json({ message: "Usuario registrado correctamente", user: new UserDTO(userWithCart) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sessionService.loginUser(email, password);
    res.json({ message: "Login exitoso", user: new UserDTO(result.user), token: result.token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const logoutUser = (_req, res) => {
  res.json({ message: "Logout exitoso" });
};

export const currentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.sub);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ user: new UserDTO(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
