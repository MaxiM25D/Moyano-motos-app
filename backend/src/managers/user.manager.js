import { User } from "../models/user.model.js";

export class UserManager {

  async getAll() {
    return await User.find();
  }

  async getById(id) {
    return await User.findById(id).lean();
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
  return await User.findById(id);
  }
  async create(userData) {
    return await User.create(userData);
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}