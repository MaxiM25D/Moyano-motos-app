import { SaleDTO } from "../dto/sale.dto.js";
import { SaleService } from "../services/sale.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const saleService = new SaleService();

export const getSales = async (req, res) => {
  try {
    const sales = await saleService.getSales();
    return sendSuccess(res, "Ventas obtenidas", {
      sales: sales.map((sale) => new SaleDTO(sale))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    return sendSuccess(res, "Venta encontrada", {
      sale: new SaleDTO(sale)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale({
      ...req.body,
      sellerId: req.user.id
    });
    return sendSuccess(res, "Venta creada", {
      sale: new SaleDTO(sale)
    }, 201);
  } catch (error) {
    return sendError(res, error);
  }
};
