import { UserDTO } from "../dto/user.dto.js";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
};

export const login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body.email, req.body.password);
    res.json({
      message: "Login correcto",
      token,
      user: new UserDTO(user)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const current = async (req, res) => {
  try {
    const user = await authService.current(req.user.id);
    res.json({
      message: "Usuario actual",
      user: new UserDTO(user)
    });
  } catch (error) {
    handleError(res, error);
  }
};
