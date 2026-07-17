import { prisma } from "../config/db/prisma.client.js";

const normalizeOptionalFields = (data) => {
  const normalizedData = { ...data };
  const optionalFields = ["domain", "chassisNumber", "engineNumber", "color"];

  for (const field of optionalFields) {
    if (Object.hasOwn(normalizedData, field) && normalizedData[field] === "") {
      normalizedData[field] = null;
    }
  }

  return normalizedData;
};

export class MotorcycleRepository {
  getMotorcycles(search) {
    const where = search
      ? {
          OR: [
            { brand: { contains: search, mode: "insensitive" } },
            { model: { contains: search, mode: "insensitive" } },
            { domain: { contains: search, mode: "insensitive" } },
            { chassisNumber: { contains: search, mode: "insensitive" } },
            { engineNumber: { contains: search, mode: "insensitive" } }
          ]
        }
      : undefined;

    return prisma.motorcycle.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
  }

  getMotorcycleById(id) {
    return prisma.motorcycle.findUnique({
      where: { id: Number(id) }
    });
  }

  getMotorcycleByUniqueField(field, value) {
    return prisma.motorcycle.findUnique({
      where: { [field]: value }
    });
  }

  createMotorcycle(data) {
    return prisma.motorcycle.create({
      data: normalizeOptionalFields(data)
    });
  }

  updateMotorcycle(id, data) {
    return prisma.motorcycle.update({
      where: { id: Number(id) },
      data: normalizeOptionalFields(data)
    });
  }

  getSaleByMotorcycleId(id) {
    return prisma.sale.findUnique({
      where: { motorcycleId: Number(id) },
      select: { id: true }
    });
  }

  deleteMotorcycle(id) {
    return prisma.motorcycle.delete({
      where: { id: Number(id) }
    });
  }
}
