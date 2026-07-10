import { UserRepository } from "../repositories/user.repository.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { HttpError } from "../utils/httpError.js";

const userRepository = new UserRepository();

export class AuthService {
  async login(email, password) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) throw new HttpError("Credenciales invalidas", 401);
    if (!user.active) throw new HttpError("Usuario inactivo", 403);
    if (!isValidPassword(user, password)) throw new HttpError("Credenciales invalidas", 401);

    return {
      token: generateToken(user),
      user
    };
  }

  async current(userId) {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new HttpError("Usuario no encontrado", 404);
    if (!user.active) throw new HttpError("Usuario inactivo", 403);

    return user;
  }
}
