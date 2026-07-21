import { InstallmentRepository } from "../repositories/installment.repository.js";
import { HttpError } from "../utils/httpError.js";

const installmentRepository = new InstallmentRepository();
const CENTS_FACTOR = 100;

const toCents = (amount) => Math.round(Number(amount) * CENTS_FACTOR);
const toMoney = (cents) => (cents / CENTS_FACTOR).toFixed(2);
const toDueDate = (value) => new Date(
  /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00.000Z` : value
);

const validateId = (id, label) => {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError(`${label} invalido`, 400);
  }
  return parsedId;
};

export class InstallmentService {
  getInstallments() {
    return installmentRepository.getInstallments();
  }

  getPendingInstallments() {
    return installmentRepository.getPendingInstallments();
  }

  getOverdueInstallments() {
    const today = new Date();
    return installmentRepository.getOverdueInstallments(today);
  }

  getInstallmentsBySaleId(saleId) {
    validateId(saleId, "ID de venta");
    return installmentRepository.getInstallmentsBySaleId(saleId);
  }

  async updateInstallment(id, data) {
    const installmentId = validateId(id, "ID de cuota");
    const installment = await installmentRepository.getInstallmentById(installmentId);

    if (!installment) throw new HttpError("Cuota no encontrada", 404);
    if (installment.status !== "PENDING") {
      throw new HttpError("Solo se pueden modificar cuotas pendientes", 409);
    }

    const updateData = {};
    if (data.amount !== undefined) updateData.amount = toMoney(toCents(data.amount));
    if (data.dueDate !== undefined) updateData.dueDate = toDueDate(data.dueDate);

    return installmentRepository.updateInstallment(installmentId, updateData);
  }

  async deleteInstallment(id) {
    const installmentId = validateId(id, "ID de cuota");
    const installment = await installmentRepository.getInstallmentById(installmentId);

    if (!installment) throw new HttpError("Cuota no encontrada", 404);
    if (installment.status !== "PENDING") {
      throw new HttpError("Solo se pueden eliminar cuotas pendientes", 409);
    }

    const installmentsCount = await installmentRepository.countInstallmentsBySaleId(installment.saleId);
    if (installmentsCount <= 1) {
      throw new HttpError("La venta debe conservar al menos una cuota", 409);
    }

    const paidInstallmentsAfter = await installmentRepository.countPaidInstallmentsAfter(
      installment.saleId,
      installment.number
    );
    if (paidInstallmentsAfter > 0) {
      throw new HttpError("No se puede eliminar porque hay cuotas posteriores pagadas", 409);
    }

    return installmentRepository.deleteInstallment(installment);
  }

  async payInstallment(id, data) {
    validateId(id, "ID de cuota");
    validateId(data.userId, "ID de usuario");

    const installment = await installmentRepository.getInstallmentById(id);
    if (!installment) throw new HttpError("Cuota no encontrada", 404);
    if (installment.status === "PAID") throw new HttpError("La cuota ya esta pagada", 409);
    if (installment.status === "CANCELLED") throw new HttpError("La cuota esta cancelada", 409);

    const user = await installmentRepository.getUserById(data.userId);
    if (!user) throw new HttpError("Usuario cobrador no encontrado", 404);

    const baseAmountCents = toCents(installment.amount);
    const interestRate = Number(data.interestRate || 0);
    const interestAmountCents = Math.round(baseAmountCents * interestRate / 100);
    const expectedAmountCents = baseAmountCents + interestAmountCents;
    const receivedAmountCents = data.amount === undefined
      ? expectedAmountCents
      : toCents(data.amount);

    if (receivedAmountCents > expectedAmountCents) {
      throw new HttpError("El importe recibido no puede superar el total de la cuota", 400);
    }

    const carriedBalanceCents = expectedAmountCents - receivedAmountCents;
    const installmentAdjustments = [];
    let balanceAllocation = null;

    if (carriedBalanceCents > 0) {
      balanceAllocation = data.balanceAllocation;
      if (!balanceAllocation) {
        throw new HttpError("Selecciona como trasladar el saldo pendiente", 400);
      }

      const futureInstallments = await installmentRepository.getFuturePendingInstallments(
        installment.saleId,
        installment.number
      );
      if (futureInstallments.length === 0) {
        throw new HttpError("La ultima cuota debe pagarse por el importe total", 409);
      }

      const targetInstallments = balanceAllocation === "NEXT_INSTALLMENT"
        ? futureInstallments.slice(0, 1)
        : futureInstallments;
      const distributedCents = Math.floor(carriedBalanceCents / targetInstallments.length);
      let remainingCents = carriedBalanceCents;

      targetInstallments.forEach((target, index) => {
        const additionCents = index === targetInstallments.length - 1
          ? remainingCents
          : distributedCents;
        remainingCents -= additionCents;
        installmentAdjustments.push({
          id: target.id,
          amount: toMoney(additionCents)
        });
      });
    }

    return installmentRepository.payInstallment(
      installment,
      {
        userId: Number(data.userId),
        amount: toMoney(receivedAmountCents),
        expectedAmount: toMoney(expectedAmountCents),
        carriedBalance: toMoney(carriedBalanceCents),
        balanceAllocation,
        interestRate: interestRate.toFixed(2),
        interestAmount: toMoney(interestAmountCents),
        method: data.method || "CASH",
        paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
        notes: data.notes
      },
      installmentAdjustments
    );
  }
}
