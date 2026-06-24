import { UserRepository } from "../repositories/user.repository.js";

const userRepository = new UserRepository();

export class UserService {
  getUsers() {
    return userRepository.getUsers();
  }

  getUserById(id) {
    return userRepository.getUserById(id);
  }

  getUserByEmail(email) {
    return userRepository.getUserByEmail(email);
  }

  createUser(data) {
    return userRepository.createUser(data);
  }

  updateUser(id, data) {
    return userRepository.updateUser(id, data);
  }

  deleteUser(id) {
    return userRepository.deleteUser(id);
  }
}
