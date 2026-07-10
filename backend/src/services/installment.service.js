import { InstallmentRepository } from "../repositories/installment.repository.js";
import { HttpError } from "../utils/httpError.js";

const installmentRepository = new InstallmentRepository();

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

  async payInstallment(id, data) {
    validateId(id, "ID de cuota");
    validateId(data.userId, "ID de usuario");

    const installment = await installmentRepository.getInstallmentById(id);
    if (!installment) throw new HttpError("Cuota no encontrada", 404);
    if (installment.status === "PAID") throw new HttpError("La cuota ya esta pagada", 409);
    if (installment.status === "CANCELLED") throw new HttpError("La cuota esta cancelada", 409);

    const user = await installmentRepository.getUserById(data.userId);
    if (!user) throw new HttpError("Usuario cobrador no encontrado", 404);

    const amount = data.amount || installment.amount;

    return installmentRepository.payInstallment(installment, {
      userId: Number(data.userId),
      amount,
      method: data.method || "CASH",
      paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
      notes: data.notes
    });
  }
}
