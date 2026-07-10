import { ReportService } from "../services/report.service.js";

const reportService = new ReportService();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
};

export const getCollectionsReport = async (req, res) => {
  try {
    const report = await reportService.getCollections(req.query);
    res.json({ message: "Reporte de cobranzas obtenido", report });
  } catch (error) {
    handleError(res, error);
  }
};

export const getOverdueReport = async (req, res) => {
  try {
    const installments = await reportService.getOverdueInstallments();
    res.json({ message: "Reporte de cuotas vencidas obtenido", installments });
  } catch (error) {
    handleError(res, error);
  }
};

export const getDebtReport = async (req, res) => {
  try {
    const report = await reportService.getDebtSummary();
    res.json({ message: "Reporte de deuda obtenido", report });
  } catch (error) {
    handleError(res, error);
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const report = await reportService.getSalesSummary(req.query);
    res.json({ message: "Reporte de ventas obtenido", report });
  } catch (error) {
    handleError(res, error);
  }
};
