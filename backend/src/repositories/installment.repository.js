import { prisma } from "../config/db/prisma.client.js";
import { addCalendarMonths } from "../utils/date.js";
import { HttpError } from "../utils/httpError.js";
import { distributeCents } from "../utils/paymentAdjustments.js";

const CENTS_FACTOR = 100;
const toCents = (amount) => Math.round(Number(amount) * CENTS_FACTOR);
const toMoney = (cents) => (cents / CENTS_FACTOR).toFixed(2);

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

  updateInstallmentPlan(installment, data) {
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
            amount: data.amount,
            dueDate: addCalendarMonths(data.dueDate, item.number - installment.number)
          }
        });
      }

      await tx.sale.update({
        where: { id: installment.saleId },
        data: { installmentAmount: data.amount }
      });

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
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(73412502, ${Number(installment.saleId)})`;

      const currentInstallment = await tx.installment.findUnique({
        where: { id: installment.id }
      });
      if (!currentInstallment || currentInstallment.status !== "PENDING") {
        throw new HttpError("La cuota ya no esta disponible para registrar el pago", 409);
      }

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

  revertPayment(installment) {
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(73412502, ${Number(installment.saleId)})`;

      const currentInstallment = await tx.installment.findUnique({
        where: { id: installment.id },
        include: {
          payment: {
            include: { receipt: true }
          }
        }
      });
      if (!currentInstallment || currentInstallment.status !== "PAID" || !currentInstallment.payment) {
        throw new HttpError("La cuota no tiene un pago para revertir", 409);
      }

      const laterPaidCount = await tx.installment.count({
        where: {
          saleId: currentInstallment.saleId,
          number: { gt: currentInstallment.number },
          status: "PAID"
        }
      });
      if (laterPaidCount > 0) {
        throw new HttpError("Primero debes revertir las cuotas posteriores que ya estan pagadas", 409);
      }

      const laterRefinancing = await tx.refinancing.findFirst({
        where: {
          saleId: currentInstallment.saleId,
          createdAt: { gt: currentInstallment.payment.createdAt }
        },
        select: { id: true }
      });
      if (laterRefinancing) {
        throw new HttpError("No se puede revertir porque la venta fue refinanciada despues de este pago", 409);
      }

      const carriedBalanceCents = toCents(currentInstallment.payment.carriedBalance || 0);
      if (carriedBalanceCents > 0) {
        const futureInstallments = await tx.installment.findMany({
          where: {
            saleId: currentInstallment.saleId,
            number: { gt: currentInstallment.number },
            status: "PENDING"
          },
          orderBy: { number: "asc" }
        });
        const targetInstallments = currentInstallment.payment.balanceAllocation === "NEXT_INSTALLMENT"
          ? futureInstallments.slice(0, 1)
          : currentInstallment.payment.balanceAllocation === "REMAINING_INSTALLMENTS"
            ? futureInstallments
            : [];

        if (!targetInstallments.length) {
          throw new HttpError("No se puede reconstruir el saldo trasladado de este pago", 409);
        }

        const deductions = distributeCents(carriedBalanceCents, targetInstallments.length);

        for (const [index, target] of targetInstallments.entries()) {
          const deductionCents = deductions[index];
          const adjustedAmountCents = toCents(target.amount) - deductionCents;

          if (adjustedAmountCents < 1) {
            throw new HttpError("No se puede revertir porque el plan fue modificado despues del pago", 409);
          }

          await tx.installment.update({
            where: { id: target.id },
            data: { amount: toMoney(adjustedAmountCents) }
          });
        }
      }

      await tx.receipt.deleteMany({
        where: { paymentId: currentInstallment.payment.id }
      });
      await tx.payment.delete({
        where: { id: currentInstallment.payment.id }
      });
      await tx.installment.update({
        where: { id: currentInstallment.id },
        data: {
          status: "PENDING",
          paidAt: null
        }
      });
      await tx.sale.update({
        where: { id: currentInstallment.saleId },
        data: { status: "ACTIVE" }
      });

      return tx.installment.findUnique({
        where: { id: currentInstallment.id },
        include: installmentInclude
      });
    });
  }
}
