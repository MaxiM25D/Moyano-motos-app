import { UserDTO } from "../dto/user.dto.js";
import { AuthService } from "../services/auth.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const authService = new AuthService();

export const login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body.email, req.body.password);
    return sendSuccess(res, "Login correcto", {
      token,
      user: new UserDTO(user)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const current = async (req, res) => {
  try {
    const user = await authService.current(req.user.id);
    return sendSuccess(res, "Usuario actual", {
      user: new UserDTO(user)
    });
  } catch (error) {
    return sendError(res, error);
  }
};
