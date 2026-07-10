import { UserRepository } from "../repositories/user.repository.js";
import { createHash } from "../utils/bcrypt.js";
import { HttpError } from "../utils/httpError.js";

const userRepository = new UserRepository();

const validateId = (id) => {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError("ID de usuario invalido", 400);
  }
  return parsedId;
};

export class UserService {
  getUsers() {
    return userRepository.getUsers();
  }

  async getUserById(id) {
    validateId(id);

    const user = await userRepository.getUserById(id);
    if (!user) throw new HttpError("Usuario no encontrado", 404);

    return user;
  }

  async createUser(data) {
    const existingUser = await userRepository.getUserByEmail(data.email);
    if (existingUser) throw new HttpError("Ya existe un usuario con ese email", 409);

    return userRepository.createUser({
      ...data,
      password: createHash(data.password)
    });
  }

  async createFirstAdmin(data) {
    const usersCount = await userRepository.countUsers();
    if (usersCount > 0) {
      throw new HttpError("El usuario inicial ya fue creado", 409);
    }

    return this.createUser({
      ...data,
      role: "ADMIN"
    });
  }

  async updateUser(id, data) {
    validateId(id);

    const user = await userRepository.getUserById(id);
    if (!user) throw new HttpError("Usuario no encontrado", 404);

    if (data.email && data.email !== user.email) {
      const existingUser = await userRepository.getUserByEmail(data.email);
      if (existingUser) throw new HttpError("Ya existe un usuario con ese email", 409);
    }

    const updateData = data.password
      ? { ...data, password: createHash(data.password) }
      : data;

    return userRepository.updateUser(id, updateData);
  }
}
