import { SaleRepository } from "../repositories/sale.repository.js";
import { HttpError } from "../utils/httpError.js";

const saleRepository = new SaleRepository();
const CENTS_FACTOR = 100;

const toCents = (amount) => Math.round(Number(amount) * CENTS_FACTOR);
const toMoney = (cents) => (cents / CENTS_FACTOR).toFixed(2);

const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const validateId = (id, label) => {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError(`${label} invalido`, 400);
  }
  return parsedId;
};

export class SaleService {
  getSales() {
    return saleRepository.getSales();
  }

  async getSaleById(id) {
    validateId(id, "ID de venta");

    const sale = await saleRepository.getSaleById(id);
    if (!sale) throw new HttpError("Venta no encontrada", 404);

    return sale;
  }

  async createSale(data) {
    const clientId = validateId(data.clientId, "ID de cliente");
    const motorcycleId = validateId(data.motorcycleId, "ID de moto");
    const sellerId = validateId(data.sellerId, "ID de vendedor");

    const client = await saleRepository.getClientById(clientId);
    if (!client) throw new HttpError("Cliente no encontrado", 404);

    const motorcycle = await saleRepository.getMotorcycleById(motorcycleId);
    if (!motorcycle) throw new HttpError("Moto no encontrada", 404);

    const seller = await saleRepository.getUserById(sellerId);
    if (!seller) throw new HttpError("Vendedor no encontrado", 404);

    const existingSale = await saleRepository.getSaleByMotorcycleId(motorcycleId);
    if (existingSale) throw new HttpError("La moto ya tiene una venta registrada", 409);

    const salePriceCents = toCents(data.salePrice);
    const downPaymentCents = toCents(data.downPayment);
    if (downPaymentCents > salePriceCents) {
      throw new HttpError("La entrega no puede superar el precio de venta", 400);
    }

    const financedCents = salePriceCents - downPaymentCents;
    if (financedCents <= 0) {
      throw new HttpError("El monto financiado debe ser mayor a 0", 400);
    }

    const installmentPlan = Number(data.installmentPlan);
    const installmentCents = Math.round(financedCents / installmentPlan);
    const saleDate = data.saleDate ? new Date(data.saleDate) : new Date();
    const firstDueDate = data.firstDueDate ? new Date(data.firstDueDate) : addMonths(saleDate, 1);

    const installments = Array.from({ length: installmentPlan }, (_, index) => {
      const number = index + 1;
      const isLastInstallment = number === installmentPlan;
      const amountCents = isLastInstallment
        ? financedCents - installmentCents * (installmentPlan - 1)
        : installmentCents;

      return {
        number,
        amount: toMoney(amountCents),
        dueDate: addMonths(firstDueDate, index)
      };
    });

    return saleRepository.createSaleWithInstallments(
      {
        clientId,
        motorcycleId,
        sellerId,
        salePrice: toMoney(salePriceCents),
        downPayment: toMoney(downPaymentCents),
        financedAmount: toMoney(financedCents),
        installmentPlan,
        installmentAmount: toMoney(installmentCents),
        saleDate
      },
      installments
    );
  }
}
