import { ReceiptDTO } from "../dto/receipt.dto.js";
import { ReceiptService } from "../services/receipt.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const receiptService = new ReceiptService();

export const getReceipts = async (req, res) => {
  try {
    const receipts = await receiptService.getReceipts();
    return sendSuccess(res, "Recibos obtenidos", {
      receipts: receipts.map((receipt) => new ReceiptDTO(receipt))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getReceiptById = async (req, res) => {
  try {
    const receipt = await receiptService.getReceiptById(req.params.id);
    return sendSuccess(res, "Recibo encontrado", {
      receipt: new ReceiptDTO(receipt)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const createReceiptFromPayment = async (req, res) => {
  try {
    const receipt = await receiptService.createReceiptFromPayment(req.params.paymentId);
    return sendSuccess(res, "Recibo generado", {
      receipt: new ReceiptDTO(receipt)
    }, 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export const printReceipt = async (req, res) => {
  try {
    const receipt = await receiptService.markAsPrinted(req.params.id);
    return sendSuccess(res, "Recibo marcado como impreso", {
      receipt: new ReceiptDTO(receipt)
    });
  } catch (error) {
    return sendError(res, error);
  }
};
