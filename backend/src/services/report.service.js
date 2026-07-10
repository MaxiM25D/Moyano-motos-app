import { ReportRepository } from "../repositories/report.repository.js";

const reportRepository = new ReportRepository();

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const endOfDay = (date) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const parseRange = (query) => {
  const from = query.from ? startOfDay(query.from) : startOfDay(new Date());
  const to = query.to ? endOfDay(query.to) : endOfDay(new Date());
  return { from, to };
};

export class ReportService {
  async getCollections(query) {
    const { from, to } = parseRange(query);
    const [payments, totals] = await Promise.all([
      reportRepository.getCollections(from, to),
      reportRepository.getCollectionsTotal(from, to)
    ]);

    return {
      from,
      to,
      totalAmount: totals._sum.amount || 0,
      totalPayments: totals._count.id,
      payments
    };
  }

  getOverdueInstallments() {
    return reportRepository.getOverdueInstallments(new Date());
  }

  async getDebtSummary() {
    const [pending, overdue, upcoming] = await reportRepository.getDebtSummary(new Date());

    return {
      pending: {
        amount: pending._sum.amount || 0,
        count: pending._count.id
      },
      overdue: {
        amount: overdue._sum.amount || 0,
        count: overdue._count.id
      },
      upcoming: {
        amount: upcoming._sum.amount || 0,
        count: upcoming._count.id
      }
    };
  }

  async getSalesSummary(query) {
    const { from, to } = parseRange(query);
    const totals = await reportRepository.getSalesSummary(from, to);

    return {
      from,
      to,
      totalSales: totals._count.id,
      salePrice: totals._sum.salePrice || 0,
      downPayment: totals._sum.downPayment || 0,
      financedAmount: totals._sum.financedAmount || 0
    };
  }
}
