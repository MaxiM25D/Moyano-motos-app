import { ReceiptDTO } from "../dto/receipt.dto.js";
import { ReceiptService } from "../services/receipt.service.js";

const receiptService = new ReceiptService();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
};

export const getReceipts = async (req, res) => {
  try {
    const receipts = await receiptService.getReceipts();
    res.json({
      message: "Recibos obtenidos",
      receipts: receipts.map((receipt) => new ReceiptDTO(receipt))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getReceiptById = async (req, res) => {
  try {
    const receipt = await receiptService.getReceiptById(req.params.id);
    res.json({
      message: "Recibo encontrado",
      receipt: new ReceiptDTO(receipt)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createReceiptFromPayment = async (req, res) => {
  try {
    const receipt = await receiptService.createReceiptFromPayment(req.params.paymentId);
    res.status(201).json({
      message: "Recibo generado",
      receipt: new ReceiptDTO(receipt)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const printReceipt = async (req, res) => {
  try {
    const receipt = await receiptService.markAsPrinted(req.params.id);
    res.json({
      message: "Recibo marcado como impreso",
      receipt: new ReceiptDTO(receipt)
    });
  } catch (error) {
    handleError(res, error);
  }
};
