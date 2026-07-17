import { prisma } from "../config/db/prisma.client.js";

const saleInclude = {
  client: true,
  motorcycle: true,
  installments: {
    orderBy: { number: "asc" }
  }
};

export class SaleRepository {
  getSales() {
    return prisma.sale.findMany({
      include: saleInclude,
      orderBy: { saleDate: "desc" }
    });
  }

  getSaleById(id) {
    return prisma.sale.findUnique({
      where: { id: Number(id) },
      include: saleInclude
    });
  }

  getSaleByMotorcycleId(motorcycleId) {
    return prisma.sale.findUnique({
      where: { motorcycleId: Number(motorcycleId) }
    });
  }

  getClientById(id) {
    return prisma.client.findUnique({
      where: { id: Number(id) }
    });
  }

  getMotorcycleById(id) {
    return prisma.motorcycle.findUnique({
      where: { id: Number(id) }
    });
  }

  getUserById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) }
    });
  }

  createSaleWithInstallments(saleData, installmentsData) {
    return prisma.sale.create({
      data: {
        ...saleData,
        installments: {
          create: installmentsData
        }
      },
      include: saleInclude
    });
  }

  deleteSale(id) {
    const saleId = Number(id);

    return prisma.$transaction(async (tx) => {
      await tx.receipt.deleteMany({
        where: {
          payment: {
            installment: { saleId }
          }
        }
      });
      await tx.payment.deleteMany({
        where: {
          installment: { saleId }
        }
      });
      await tx.installment.deleteMany({ where: { saleId } });
      return tx.sale.delete({ where: { id: saleId } });
    });
  }
}
