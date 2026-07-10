import { SaleDTO } from "../dto/sale.dto.js";
import { SaleService } from "../services/sale.service.js";

const saleService = new SaleService();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
};

export const getSales = async (req, res) => {
  try {
    const sales = await saleService.getSales();
    res.json({
      message: "Ventas obtenidas",
      sales: sales.map((sale) => new SaleDTO(sale))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    res.json({
      message: "Venta encontrada",
      sale: new SaleDTO(sale)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale({
      ...req.body,
      sellerId: req.user.id
    });
    res.status(201).json({
      message: "Venta creada",
      sale: new SaleDTO(sale)
    });
  } catch (error) {
    handleError(res, error);
  }
};
