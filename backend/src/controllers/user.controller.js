import { UserService } from "../services/user.service.js";
import { UserDTO }     from "../dto/user.dto.js";

const userService = new UserService();

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json({ message: "Usuarios obtenidos", users: users.map((u) => new UserDTO(u)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario encontrado", user: new UserDTO(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
