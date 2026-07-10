import { ReceiptRepository } from "../repositories/receipt.repository.js";
import { HttpError } from "../utils/httpError.js";

const receiptRepository = new ReceiptRepository();

const validateId = (id, label) => {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError(`${label} invalido`, 400);
  }
  return parsedId;
};

const buildReceiptNumber = (paymentId) => {
  const date = new Date();
  const year = date.getFullYear();
  const paddedPaymentId = String(paymentId).padStart(8, "0");
  return `REC-${year}-${paddedPaymentId}`;
};

export class ReceiptService {
  getReceipts() {
    return receiptRepository.getReceipts();
  }

  async getReceiptById(id) {
    validateId(id, "ID de recibo");

    const receipt = await receiptRepository.getReceiptById(id);
    if (!receipt) throw new HttpError("Recibo no encontrado", 404);

    return receipt;
  }

  async createReceiptFromPayment(paymentId) {
    const parsedPaymentId = validateId(paymentId, "ID de pago");

    const payment = await receiptRepository.getPaymentById(parsedPaymentId);
    if (!payment) throw new HttpError("Pago no encontrado", 404);

    const existingReceipt = await receiptRepository.getReceiptByPaymentId(parsedPaymentId);
    if (existingReceipt) return existingReceipt;

    return receiptRepository.createReceipt(parsedPaymentId, buildReceiptNumber(parsedPaymentId));
  }

  async markAsPrinted(id) {
    await this.getReceiptById(id);
    return receiptRepository.markAsPrinted(id);
  }
}
