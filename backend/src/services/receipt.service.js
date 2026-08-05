import { ReceiptRepository } from "../repositories/receipt.repository.js";
import { HttpError } from "../utils/httpError.js";
import { buildPagination, parsePagination } from "../utils/pagination.js";

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
  async getReceipts(query = {}) {
    const { page, pageSize, skip } = parsePagination(query);
    const search = query.search?.trim();
    const numericSearch = Number(search);
    const where = search ? {
      OR: [
        { receiptNumber: { contains: search, mode: "insensitive" } },
        { payment: { installment: { sale: { client: { name: { contains: search, mode: "insensitive" } } } } } },
        { payment: { installment: { sale: { client: { dni: { contains: search } } } } } },
        { payment: { installment: { sale: { motorcycle: { domain: { contains: search, mode: "insensitive" } } } } } },
        ...(Number.isInteger(numericSearch) && numericSearch > 0
          ? [{ payment: { installment: { sale: { saleNumber: numericSearch } } } }]
          : [])
      ]
    } : undefined;
    const [{ receipts, total }, summary] = await Promise.all([
      receiptRepository.getReceipts({ where, skip, take: pageSize }),
      receiptRepository.getReceiptSummary()
    ]);

    return { receipts, summary, pagination: buildPagination(total, page, pageSize) };
  }

  async getPaymentsWithoutReceipt(query = {}) {
    const { page, pageSize, skip } = parsePagination(query);
    const search = query.search?.trim();
    const numericSearch = Number(search);
    const searchWhere = search ? {
      OR: [
        { sale: { client: { name: { contains: search, mode: "insensitive" } } } },
        { sale: { client: { dni: { contains: search } } } },
        { sale: { motorcycle: { domain: { contains: search, mode: "insensitive" } } } },
        ...(Number.isInteger(numericSearch) && numericSearch > 0
          ? [{ sale: { saleNumber: numericSearch } }]
          : [])
      ]
    } : undefined;
    const receiptWhere = { status: "PAID", payment: { is: { receipt: { is: null } } } };
    const where = searchWhere ? { AND: [receiptWhere, searchWhere] } : receiptWhere;
    const [{ installments, total }, summary] = await Promise.all([
      receiptRepository.getPaymentsWithoutReceipt({ where, skip, take: pageSize }),
      receiptRepository.getReceiptSummary()
    ]);

    return { installments, summary, pagination: buildPagination(total, page, pageSize) };
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
