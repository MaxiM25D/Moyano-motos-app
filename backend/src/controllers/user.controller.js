import { UserDTO } from "../dto/user.dto.js";
import { UserService } from "../services/user.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const userService = new UserService();

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return sendSuccess(res, "Usuarios obtenidos", {
      users: users.map((user) => new UserDTO(user))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, "Usuario encontrado", {
      user: new UserDTO(user)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return sendSuccess(res, "Usuario creado", {
      user: new UserDTO(user)
    }, 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export const createFirstAdmin = async (req, res) => {
  try {
    const user = await userService.createFirstAdmin(req.body);
    return sendSuccess(res, "Usuario administrador inicial creado", {
      user: new UserDTO(user)
    }, 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return sendSuccess(res, "Usuario actualizado", {
      user: new UserDTO(user)
    });
  } catch (error) {
    return sendError(res, error);
  }
};
