import { prisma } from "../config/db/prisma.client.js";

export class ClientRepository {
  getClients(search) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { dni: { contains: search } },
            { phone: { contains: search } }
          ]
        }
      : undefined;

    return prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
  }

  getClientById(id) {
    return prisma.client.findUnique({
      where: { id: Number(id) }
    });
  }

  getClientByDni(dni) {
    return prisma.client.findUnique({
      where: { dni }
    });
  }

  createClient(data) {
    return prisma.client.create({
      data
    });
  }

  updateClient(id, data) {
    return prisma.client.update({
      where: { id: Number(id) },
      data
    });
  }
}
