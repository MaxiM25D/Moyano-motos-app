import { UserRepository } from "../repositories/user.repository.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { generateToken }   from "../utils/jwt.js";

const userRepository = new UserRepository();

export class SessionService {
  async loginUser(email, password) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = isValidPassword(user, password);
    if (!valid) throw new Error("Invalid credentials");

    const token = generateToken(user);
    return { user, token };
  }
}
