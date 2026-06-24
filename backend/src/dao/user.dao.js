import { User } from "../models/user.model.js";

export class UserDAO {
  getAll() {
    return User.find();
  }

  getById(id) {
    return User.findById(id).lean();
  }

  getByEmail(email) {
    return User.findOne({ email });
  }

  create(userData) {
    return User.create(userData);
  }

  update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return User.findByIdAndDelete(id);
  }
}
