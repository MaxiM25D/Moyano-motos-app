import { prisma } from "../config/db/prisma.client.js";

const installmentInclude = {
  payment: {
    include: {
      receipt: true
    }
  },
  sale: {
    include: {
      client: true,
      motorcycle: true
    }
  }
};

export class InstallmentRepository {
  getInstallments() {
    return prisma.installment.findMany({
      include: installmentInclude,
      orderBy: [{ dueDate: "asc" }, { number: "asc" }]
    });
  }

  getPendingInstallments() {
    return prisma.installment.findMany({
      where: { status: "PENDING" },
      include: installmentInclude,
      orderBy: [{ dueDate: "asc" }, { number: "asc" }]
    });
  }

  getOverdueInstallments(today) {
    return prisma.installment.findMany({
      where: {
        status: "PENDING",
        dueDate: { lt: today }
      },
      include: installmentInclude,
      orderBy: [{ dueDate: "asc" }, { number: "asc" }]
    });
  }

  getInstallmentsBySaleId(saleId) {
    return prisma.installment.findMany({
      where: { saleId: Number(saleId) },
      include: installmentInclude,
      orderBy: { number: "asc" }
    });
  }

  getInstallmentById(id) {
    return prisma.installment.findUnique({
      where: { id: Number(id) },
      include: installmentInclude
    });
  }

  getUserById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) }
    });
  }

  payInstallment(installment, paymentData) {
    return prisma.$transaction(async (tx) => {
      const paidInstallment = await tx.installment.update({
        where: { id: installment.id },
        data: {
          status: "PAID",
          paidAt: paymentData.paidAt
        },
        include: installmentInclude
      });

      await tx.payment.create({
        data: {
          installmentId: installment.id,
          userId: paymentData.userId,
          amount: paymentData.amount,
          method: paymentData.method,
          paidAt: paymentData.paidAt,
          notes: paymentData.notes || null
        }
      });

      const pendingCount = await tx.installment.count({
        where: {
          saleId: installment.saleId,
          status: { not: "PAID" }
        }
      });

      if (pendingCount === 0) {
        await tx.sale.update({
          where: { id: installment.saleId },
          data: { status: "PAID" }
        });
      }

      return tx.installment.findUnique({
        where: { id: paidInstallment.id },
        include: installmentInclude
      });
    });
  }
}
