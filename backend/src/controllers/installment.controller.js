import { InstallmentDTO } from "../dto/installment.dto.js";
import { InstallmentService } from "../services/installment.service.js";

const installmentService = new InstallmentService();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
};

export const getInstallments = async (req, res) => {
  try {
    const installments = await installmentService.getInstallments();
    res.json({
      message: "Cuotas obtenidas",
      installments: installments.map((installment) => new InstallmentDTO(installment))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getPendingInstallments = async (req, res) => {
  try {
    const installments = await installmentService.getPendingInstallments();
    res.json({
      message: "Cuotas pendientes obtenidas",
      installments: installments.map((installment) => new InstallmentDTO(installment))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getOverdueInstallments = async (req, res) => {
  try {
    const installments = await installmentService.getOverdueInstallments();
    res.json({
      message: "Cuotas vencidas obtenidas",
      installments: installments.map((installment) => new InstallmentDTO(installment))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getInstallmentsBySaleId = async (req, res) => {
  try {
    const installments = await installmentService.getInstallmentsBySaleId(req.params.saleId);
    res.json({
      message: "Cuotas de la venta obtenidas",
      installments: installments.map((installment) => new InstallmentDTO(installment))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const payInstallment = async (req, res) => {
  try {
    const installment = await installmentService.payInstallment(req.params.id, {
      ...req.body,
      userId: req.user.id
    });
    res.json({
      message: "Pago registrado",
      installment: new InstallmentDTO(installment)
    });
  } catch (error) {
    handleError(res, error);
  }
};
