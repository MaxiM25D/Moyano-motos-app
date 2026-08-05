import { prisma } from "../config/db/prisma.client.js";

export class ClientRepository {
  async getClients({ search, skip, take }) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { dni: { contains: search } },
            { phone: { contains: search } }
          ]
        }
      : undefined;

    const [clients, total] = await prisma.$transaction([
      prisma.client.findMany({
        where,
        skip,
        take,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }]
      }),
      prisma.client.count({ where })
    ]);

    return { clients, total };
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

  countSales(id) {
    return prisma.sale.count({
      where: { clientId: Number(id) }
    });
  }

  deleteClient(id) {
    return prisma.client.delete({
      where: { id: Number(id) }
    });
  }
}
