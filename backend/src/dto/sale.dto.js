import { RefinancingDTO } from "./refinancing.dto.js";

export class SaleDTO {
  constructor(sale) {
    const installments = sale.installments || [];
    const paidTotalCents = installments.reduce((total, installment) => {
      if (installment.status !== "PAID") return total;
      const amount = installment.payment?.amount || installment.amount;
      return total + Math.round(Number(amount) * 100);
    }, 0);
    const outstandingBalanceCents = installments.reduce((total, installment) => {
      if (["PAID", "CANCELLED"].includes(installment.status)) return total;
      return total + Math.round(Number(installment.amount) * 100);
    }, 0);
    const scheduledTotalCents = installments.reduce((total, installment) => {
      if (installment.status === "CANCELLED") return total;

      const amount = installment.status === "PAID" && installment.payment
        ? installment.payment.amount
        : installment.amount;
      return total + Math.round(Number(amount) * 100);
    }, 0);

    this.id = sale.id;
    this.saleNumber = sale.saleNumber;
    this.clientId = sale.clientId;
    this.motorcycleId = sale.motorcycleId;
    this.sellerId = sale.sellerId;
    this.salePrice = sale.salePrice;
    this.downPayment = sale.downPayment;
    this.financedAmount = sale.financedAmount;
    this.financingInterestRate = sale.financingInterestRate || 0;
    this.financingInterestAmount = sale.financingInterestAmount || 0;
    this.paidAmount = (paidTotalCents / 100).toFixed(2);
    this.outstandingBalance = installments.length
      ? (outstandingBalanceCents / 100).toFixed(2)
      : (Number(sale.financedAmount) + Number(sale.financingInterestAmount || 0)).toFixed(2);
    this.totalFinancedAmount = installments.length
      ? (scheduledTotalCents / 100).toFixed(2)
      : (Number(sale.financedAmount) + Number(sale.financingInterestAmount || 0)).toFixed(2);
    this.installmentPlan = sale.installmentPlan;
    this.installmentAmount = sale.installmentAmount;
    this.status = sale.status;
    this.saleDate = sale.saleDate;
    this.client = sale.client || null;
    this.motorcycle = sale.motorcycle || null;
    this.seller = sale.seller || null;
    this.saleReceipt = sale.saleReceipt || null;
    this.refinancings = (sale.refinancings || []).map(
      (refinancing) => new RefinancingDTO(refinancing)
    );
    this.installments = installments;
    this.createdAt = sale.createdAt;
    this.updatedAt = sale.updatedAt;
  }
}
