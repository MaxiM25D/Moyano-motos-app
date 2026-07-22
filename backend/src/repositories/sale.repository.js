import { prisma } from "../config/db/prisma.client.js";

const saleInclude = {
  client: true,
  motorcycle: true,
  seller: {
    select: { name: true, email: true }
  },
  saleReceipt: true,
  installments: {
    include: {
      payment: {
        select: { amount: true }
      }
    },
    orderBy: { number: "asc" }
  }
};

export class SaleRepository {
  getSales() {
    return prisma.sale.findMany({
      include: saleInclude,
      orderBy: { saleNumber: "desc" }
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
    // Serialize number assignment so concurrent sales cannot receive the same business number.
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(73412501)`;
      const latestSale = await tx.sale.aggregate({
        _max: { saleNumber: true }
      });

      const saleNumber = (latestSale._max.saleNumber || 0) + 1;
      const saleYear = new Date(saleData.saleDate).getFullYear();

      return tx.sale.create({
        data: {
          ...saleData,
          saleNumber,
          saleReceipt: {
            create: {
              receiptNumber: `VTA-${saleYear}-${String(saleNumber).padStart(8, "0")}`
            }
          },
          installments: {
            create: installmentsData
          }
        },
        include: saleInclude
      });
    });
  }

  deleteSale(id) {
    const saleId = Number(id);

    return prisma.$transaction(async (tx) => {
      await tx.saleReceipt.deleteMany({ where: { saleId } });
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

  markSaleReceiptPrinted(saleId) {
    return prisma.saleReceipt.update({
      where: { saleId: Number(saleId) },
      data: { printedAt: new Date() }
    });
  }
}
