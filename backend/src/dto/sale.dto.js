export class SaleDTO {
  constructor(sale) {
    this.id = sale.id;
    this.clientId = sale.clientId;
    this.motorcycleId = sale.motorcycleId;
    this.sellerId = sale.sellerId;
    this.salePrice = sale.salePrice;
    this.downPayment = sale.downPayment;
    this.financedAmount = sale.financedAmount;
    this.installmentPlan = sale.installmentPlan;
    this.installmentAmount = sale.installmentAmount;
    this.status = sale.status;
    this.saleDate = sale.saleDate;
    this.client = sale.client || null;
    this.motorcycle = sale.motorcycle || null;
    this.installments = sale.installments || [];
    this.createdAt = sale.createdAt;
    this.updatedAt = sale.updatedAt;
  }
}
