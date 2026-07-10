import { prisma } from "../config/db/prisma.client.js";

export class UserRepository {
  getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  countUsers() {
    return prisma.user.count();
  }

  getUserById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) }
    });
  }

  getUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  createUser(data) {
    return prisma.user.create({ data });
  }

  updateUser(id, data) {
    return prisma.user.update({
      where: { id: Number(id) },
      data
    });
  }
}
