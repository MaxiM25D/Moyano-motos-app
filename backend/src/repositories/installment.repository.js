import { prisma } from "../config/db/prisma.client.js";
import { addCalendarMonths } from "../utils/date.js";

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

const normalizePendingDueDates = async (tx, saleId) => {
  const installments = await tx.installment.findMany({
    where: { saleId: Number(saleId) },
    orderBy: { number: "asc" }
  });
  const firstInstallment = installments[0];
  if (!firstInstallment) return;

  for (const installment of installments) {
    if (installment.status !== "PENDING") continue;

    const dueDate = addCalendarMonths(firstInstallment.dueDate, installment.number - 1);
    if (dueDate.getTime() !== installment.dueDate.getTime()) {
      await tx.installment.update({
        where: { id: installment.id },
        data: { dueDate }
      });
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

  getSaleWithInstallments(saleId) {
    return prisma.sale.findUnique({
      where: { id: Number(saleId) },
      include: {
        installments: {
          orderBy: { number: "asc" }
        }
      }
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

  rescheduleInstallments(installment, dueDate) {
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(73412502, ${Number(installment.saleId)})`;

      const installmentsToUpdate = await tx.installment.findMany({
        where: {
          saleId: installment.saleId,
          number: { gte: installment.number },
          status: "PENDING"
        },
        orderBy: { number: "asc" }
      });

      for (const item of installmentsToUpdate) {
        await tx.installment.update({
          where: { id: item.id },
          data: {
            dueDate: addCalendarMonths(dueDate, item.number - installment.number)
          }
        });
      }

      return tx.installment.findUnique({
        where: { id: installment.id },
        include: installmentInclude
      });
    });
  }

  createInstallment(saleId, data) {
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(73412502, ${Number(saleId)})`;

      await normalizePendingDueDates(tx, saleId);

      const latestInstallment = await tx.installment.findFirst({
        where: { saleId: Number(saleId) },
        orderBy: { number: "desc" }
      });
      const number = (latestInstallment?.number || 0) + 1;

      const installment = await tx.installment.create({
        data: {
          saleId: Number(saleId),
          number,
          amount: data.amount,
          dueDate: data.dueDate
        }
      });

      const installmentPlan = await tx.installment.count({
        where: { saleId: Number(saleId) }
      });
      await tx.sale.update({
        where: { id: Number(saleId) },
        data: {
          installmentPlan,
          status: "ACTIVE"
        }
      });

      return tx.installment.findUnique({
        where: { id: installment.id },
        include: installmentInclude
      });
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

      await normalizePendingDueDates(tx, installment.saleId);

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
