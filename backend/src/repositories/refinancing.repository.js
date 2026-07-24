import { prisma } from "../config/db/prisma.client.js";
import { addCalendarMonths } from "../utils/date.js";
import { HttpError } from "../utils/httpError.js";

const CENTS_FACTOR = 100;
const toCents = (amount) => Math.round(Number(amount) * CENTS_FACTOR);
const toMoney = (cents) => (cents / CENTS_FACTOR).toFixed(2);

const refinancingInclude = {
  createdBy: {
    select: { name: true, email: true }
  }
};

const toPlanSnapshot = (installments) => installments.map((installment) => ({
  number: installment.number,
  amount: Number(installment.amount).toFixed(2),
  dueDate: installment.dueDate.toISOString(),
  status: installment.status
}));

export class RefinancingRepository {
  refinanceSale(saleId, createdById, data) {
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(73412502, ${Number(saleId)})`;

      const sale = await tx.sale.findUnique({
        where: { id: Number(saleId) },
        include: {
          installments: { orderBy: { number: "asc" } },
          saleReceipt: true
        }
      });
      if (!sale) throw new HttpError("Venta no encontrada", 404);
      if (sale.status === "CANCELLED") {
        throw new HttpError("No se puede refinanciar una venta cancelada", 409);
      }

      const selectedInstallment = sale.installments.find(
        (installment) => installment.id === Number(data.startInstallmentId)
      );
      if (!selectedInstallment) {
        throw new HttpError("La cuota seleccionada no pertenece a la venta", 400);
      }
      if (selectedInstallment.status !== "PENDING") {
        throw new HttpError("La refinanciacion debe comenzar en una cuota pendiente", 409);
      }

      const installmentsToReplace = sale.installments.filter(
        (installment) => installment.number >= selectedInstallment.number
      );
      if (installmentsToReplace.some((installment) => installment.status !== "PENDING")) {
        throw new HttpError("No se puede refinanciar porque hay cuotas posteriores pagadas o canceladas", 409);
      }

      const previousBalanceCents = installmentsToReplace.reduce(
        (total, installment) => total + toCents(installment.amount),
        0
      );
      const interestAmountCents = Math.round(previousBalanceCents * Number(data.interestRate) / 100);
      const totalAmountCents = previousBalanceCents + interestAmountCents;
      const installmentCount = Number(data.installmentCount);
      const regularInstallmentCents = Math.floor(totalAmountCents / installmentCount);

      if (regularInstallmentCents < 1) {
        throw new HttpError("La cantidad de cuotas supera el saldo disponible", 400);
      }

      const newInstallments = Array.from({ length: installmentCount }, (_, index) => {
        const isLast = index === installmentCount - 1;
        const amountCents = isLast
          ? totalAmountCents - regularInstallmentCents * (installmentCount - 1)
          : regularInstallmentCents;

        return {
          saleId: sale.id,
          number: selectedInstallment.number + index,
          amount: toMoney(amountCents),
          dueDate: addCalendarMonths(data.firstDueDate, index)
        };
      });

      const previousPlan = toPlanSnapshot(installmentsToReplace);
      const newPlan = newInstallments.map((installment) => ({
        number: installment.number,
        amount: installment.amount,
        dueDate: installment.dueDate.toISOString(),
        status: "PENDING"
      }));

      if (sale.saleReceipt && !sale.saleReceipt.planSnapshot) {
        const activeInstallments = sale.installments.filter(
          (installment) => installment.status !== "CANCELLED"
        );
        const totalCents = activeInstallments.reduce(
          (total, installment) => total + toCents(installment.amount),
          0
        );
        await tx.saleReceipt.update({
          where: { id: sale.saleReceipt.id },
          data: {
            planSnapshot: {
              installmentPlan: activeInstallments.length,
              totalFinancedAmount: toMoney(totalCents),
              installments: toPlanSnapshot(activeInstallments)
            }
          }
        });
      }

      await tx.installment.deleteMany({
        where: { id: { in: installmentsToReplace.map((installment) => installment.id) } }
      });
      await tx.installment.createMany({ data: newInstallments });

      const latestRefinancing = await tx.refinancing.aggregate({
        where: { saleId: sale.id },
        _max: { sequence: true }
      });
      const sequence = (latestRefinancing._max.sequence || 0) + 1;
      const year = new Date().getFullYear();

      const refinancing = await tx.refinancing.create({
        data: {
          saleId: sale.id,
          createdById: Number(createdById),
          sequence,
          startInstallmentNumber: selectedInstallment.number,
          previousBalance: toMoney(previousBalanceCents),
          interestRate: Number(data.interestRate).toFixed(2),
          interestAmount: toMoney(interestAmountCents),
          totalAmount: toMoney(totalAmountCents),
          installmentCount,
          installmentAmount: toMoney(regularInstallmentCents),
          firstDueDate: data.firstDueDate,
          previousPlan,
          newPlan,
          notes: data.notes || null,
          receiptNumber: `REF-${year}-${String(sale.saleNumber).padStart(8, "0")}-${String(sequence).padStart(2, "0")}`
        },
        include: refinancingInclude
      });

      const installmentPlan = await tx.installment.count({
        where: { saleId: sale.id }
      });
      await tx.sale.update({
        where: { id: sale.id },
        data: {
          installmentPlan,
          installmentAmount: toMoney(regularInstallmentCents),
          status: "ACTIVE"
        }
      });

      return refinancing;
    });
  }

  getById(id) {
    return prisma.refinancing.findUnique({
      where: { id: Number(id) },
      include: refinancingInclude
    });
  }

  markReceiptPrinted(id) {
    return prisma.refinancing.update({
      where: { id: Number(id) },
      data: { printedAt: new Date() },
      include: refinancingInclude
    });
  }
}
