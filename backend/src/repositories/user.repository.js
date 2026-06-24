import { UserDAO } from "../dao/user.dao.js";

const userDAO = new UserDAO();

export class UserRepository {
  getUsers() {
    return userDAO.getAll();
  }

  getUserById(id) {
    return userDAO.getById(id);
  }

  getUserByEmail(email) {
    return userDAO.getByEmail(email);
  }

  createUser(data) {
    return userDAO.create(data);
  }

  updateUser(id, data) {
    return userDAO.update(id, data);
  }

  deleteUser(id) {
    return userDAO.delete(id);
  }
}
