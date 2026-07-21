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

  getFuturePendingInstallments(saleId, number) {
    return prisma.installment.findMany({
      where: {
        saleId: Number(saleId),
        number: { gt: Number(number) },
        status: "PENDING"
      },
      orderBy: { number: "asc" }
    });
  }

  updateInstallment(id, data) {
    return prisma.installment.update({
      where: { id: Number(id) },
      data,
      include: installmentInclude
    });
  }

  countInstallmentsBySaleId(saleId) {
    return prisma.installment.count({
      where: { saleId: Number(saleId) }
    });
  }

  countPaidInstallmentsAfter(saleId, number) {
    return prisma.installment.count({
      where: {
        saleId: Number(saleId),
        number: { gt: Number(number) },
        status: "PAID"
      }
    });
  }

  deleteInstallment(installment) {
    return prisma.$transaction(async (tx) => {
      await tx.installment.delete({ where: { id: installment.id } });

      const laterInstallments = await tx.installment.findMany({
        where: {
          saleId: installment.saleId,
          number: { gt: installment.number }
        },
        orderBy: { number: "asc" }
      });

      for (const laterInstallment of laterInstallments) {
        await tx.installment.update({
          where: { id: laterInstallment.id },
          data: { number: laterInstallment.number - 1 }
        });
      }

      const installmentPlan = await tx.installment.count({
        where: { saleId: installment.saleId }
      });
      const unpaidCount = await tx.installment.count({
        where: {
          saleId: installment.saleId,
          status: { not: "PAID" }
        }
      });

      await tx.sale.update({
        where: { id: installment.saleId },
        data: {
          installmentPlan,
          ...(unpaidCount === 0 ? { status: "PAID" } : {})
        }
      });

      return installment;
    });
  }

  payInstallment(installment, paymentData, installmentAdjustments) {
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
          expectedAmount: paymentData.expectedAmount,
          carriedBalance: paymentData.carriedBalance,
          balanceAllocation: paymentData.balanceAllocation,
          interestRate: paymentData.interestRate,
          interestAmount: paymentData.interestAmount,
          method: paymentData.method,
          paidAt: paymentData.paidAt,
          notes: paymentData.notes || null
        }
      });

      for (const adjustment of installmentAdjustments) {
        await tx.installment.update({
          where: { id: adjustment.id },
          data: { amount: { increment: adjustment.amount } }
        });
      }

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
