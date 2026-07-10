import { UserDTO } from "../dto/user.dto.js";
import { UserService } from "../services/user.service.js";

const userService = new UserService();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
};

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json({
      message: "Usuarios obtenidos",
      users: users.map((user) => new UserDTO(user))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({
      message: "Usuario encontrado",
      user: new UserDTO(user)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      message: "Usuario creado",
      user: new UserDTO(user)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createFirstAdmin = async (req, res) => {
  try {
    const user = await userService.createFirstAdmin(req.body);
    res.status(201).json({
      message: "Usuario administrador inicial creado",
      user: new UserDTO(user)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({
      message: "Usuario actualizado",
      user: new UserDTO(user)
    });
  } catch (error) {
    handleError(res, error);
  }
};
