import { UserManager } from "../managers/user.manager.js";

const userManager = new UserManager();

export const getUsers = async (req, res) => {
  try {
    const users = await userManager.getAll();
    res.json({message: "Usuarios obtenidos con exito!", users});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userManager.getById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({message: "Usuario por ID obtenido con exito!", user});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};