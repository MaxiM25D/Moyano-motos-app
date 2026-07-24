import { RefinancingDTO } from "../dto/refinancing.dto.js";
import { SaleDTO } from "../dto/sale.dto.js";
import { RefinancingService } from "../services/refinancing.service.js";
import { SaleService } from "../services/sale.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const refinancingService = new RefinancingService();
const saleService = new SaleService();

export const createRefinancing = async (req, res) => {
  try {
    const refinancing = await refinancingService.createRefinancing(req.params.saleId, {
      ...req.body,
      createdById: req.user.id
    });
    const sale = await saleService.getSaleById(req.params.saleId);

    return sendSuccess(res, "Saldo refinanciado", {
      refinancing: new RefinancingDTO(refinancing),
      sale: new SaleDTO(sale)
    }, 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export const markRefinancingReceiptPrinted = async (req, res) => {
  try {
    const refinancing = await refinancingService.markReceiptPrinted(req.params.id);
    return sendSuccess(res, "Comprobante de refinanciacion preparado", {
      refinancing: new RefinancingDTO(refinancing)
    });
  } catch (error) {
    return sendError(res, error);
  }
};
