import { RefinancingRepository } from "../repositories/refinancing.repository.js";
import { HttpError } from "../utils/httpError.js";

const refinancingRepository = new RefinancingRepository();

const validateId = (id, label) => {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError(`${label} invalido`, 400);
  }
  return parsedId;
};

const toDueDate = (value) => new Date(
  /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00.000Z` : value
);

export class RefinancingService {
  createRefinancing(saleId, data) {
    const parsedSaleId = validateId(saleId, "ID de venta");
    const createdById = validateId(data.createdById, "ID de usuario");
    validateId(data.startInstallmentId, "ID de cuota");

    return refinancingRepository.refinanceSale(parsedSaleId, createdById, {
      ...data,
      interestRate: Number(data.interestRate || 0),
      installmentCount: Number(data.installmentCount),
      firstDueDate: toDueDate(data.firstDueDate)
    });
  }

  async markReceiptPrinted(id) {
    const refinancingId = validateId(id, "ID de refinanciacion");
    const refinancing = await refinancingRepository.getById(refinancingId);
    if (!refinancing) throw new HttpError("Refinanciacion no encontrada", 404);

    return refinancingRepository.markReceiptPrinted(refinancingId);
  }
}
