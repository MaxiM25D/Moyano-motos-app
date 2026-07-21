import { InstallmentDTO } from "../dto/installment.dto.js";
import { InstallmentService } from "../services/installment.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const installmentService = new InstallmentService();

export const getInstallments = async (req, res) => {
  try {
    const installments = await installmentService.getInstallments();
    return sendSuccess(res, "Cuotas obtenidas", {
      installments: installments.map((installment) => new InstallmentDTO(installment))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getPendingInstallments = async (req, res) => {
  try {
    const installments = await installmentService.getPendingInstallments();
    return sendSuccess(res, "Cuotas pendientes obtenidas", {
      installments: installments.map((installment) => new InstallmentDTO(installment))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getOverdueInstallments = async (req, res) => {
  try {
    const installments = await installmentService.getOverdueInstallments();
    return sendSuccess(res, "Cuotas vencidas obtenidas", {
      installments: installments.map((installment) => new InstallmentDTO(installment))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getInstallmentsBySaleId = async (req, res) => {
  try {
    const installments = await installmentService.getInstallmentsBySaleId(req.params.saleId);
    return sendSuccess(res, "Cuotas de la venta obtenidas", {
      installments: installments.map((installment) => new InstallmentDTO(installment))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateInstallment = async (req, res) => {
  try {
    const installment = await installmentService.updateInstallment(req.params.id, req.body);
    return sendSuccess(res, "Cuota actualizada", {
      installment: new InstallmentDTO(installment)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deleteInstallment = async (req, res) => {
  try {
    const installment = await installmentService.deleteInstallment(req.params.id);
    return sendSuccess(res, "Cuota eliminada", {
      installment: new InstallmentDTO(installment)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const payInstallment = async (req, res) => {
  try {
    const installment = await installmentService.payInstallment(req.params.id, {
      ...req.body,
      userId: req.user.id
    });
    return sendSuccess(res, "Pago registrado", {
      installment: new InstallmentDTO(installment)
    });
  } catch (error) {
    return sendError(res, error);
  }
};
