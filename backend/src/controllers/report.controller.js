import { ReportService } from "../services/report.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const reportService = new ReportService();

export const getCollectionsReport = async (req, res) => {
  try {
    const report = await reportService.getCollections(req.query);
    return sendSuccess(res, "Reporte de cobranzas obtenido", { report });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getOverdueReport = async (req, res) => {
  try {
    const installments = await reportService.getOverdueInstallments();
    return sendSuccess(res, "Reporte de cuotas vencidas obtenido", { installments });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getDebtReport = async (req, res) => {
  try {
    const report = await reportService.getDebtSummary();
    return sendSuccess(res, "Reporte de deuda obtenido", { report });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const report = await reportService.getSalesSummary(req.query);
    return sendSuccess(res, "Reporte de ventas obtenido", { report });
  } catch (error) {
    return sendError(res, error);
  }
};
