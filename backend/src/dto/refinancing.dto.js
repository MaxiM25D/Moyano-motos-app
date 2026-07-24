export class RefinancingDTO {
  constructor(refinancing) {
    this.id = refinancing.id;
    this.saleId = refinancing.saleId;
    this.createdById = refinancing.createdById;
    this.sequence = refinancing.sequence;
    this.startInstallmentNumber = refinancing.startInstallmentNumber;
    this.previousBalance = refinancing.previousBalance;
    this.interestRate = refinancing.interestRate;
    this.interestAmount = refinancing.interestAmount;
    this.totalAmount = refinancing.totalAmount;
    this.installmentCount = refinancing.installmentCount;
    this.installmentAmount = refinancing.installmentAmount;
    this.firstDueDate = refinancing.firstDueDate;
    this.previousPlan = refinancing.previousPlan;
    this.newPlan = refinancing.newPlan;
    this.notes = refinancing.notes;
    this.receiptNumber = refinancing.receiptNumber;
    this.printedAt = refinancing.printedAt;
    this.createdBy = refinancing.createdBy || null;
    this.createdAt = refinancing.createdAt;
  }
}
