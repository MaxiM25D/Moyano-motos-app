export class ReceiptDTO {
  constructor(receipt) {
    this.id = receipt.id;
    this.paymentId = receipt.paymentId;
    this.receiptNumber = receipt.receiptNumber;
    this.printedAt = receipt.printedAt;
    this.createdAt = receipt.createdAt;
    this.payment = receipt.payment || null;
  }
}
