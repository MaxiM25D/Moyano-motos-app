export class InstallmentDTO {
  constructor(installment) {
    this.id = installment.id;
    this.saleId = installment.saleId;
    this.number = installment.number;
    this.amount = installment.amount;
    this.dueDate = installment.dueDate;
    this.status = installment.status;
    this.paidAt = installment.paidAt;
    this.payment = installment.payment || null;
    this.sale = installment.sale || null;
    this.createdAt = installment.createdAt;
    this.updatedAt = installment.updatedAt;
  }
}
