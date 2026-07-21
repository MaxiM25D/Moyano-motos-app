export class ReceiptDTO {
  constructor(receipt) {
    const payment = receipt.payment || null;
    const installment = payment?.installment || null;
    const sale = installment?.sale || null;
    const client = sale?.client || null;
    const motorcycle = sale?.motorcycle || null;
    const collector = payment?.user || null;

    this.id = receipt.id;
    this.paymentId = receipt.paymentId;
    this.receiptNumber = receipt.receiptNumber;
    this.printedAt = receipt.printedAt;
    this.createdAt = receipt.createdAt;
    this.payment = payment;
    this.printable = {
      receiptNumber: receipt.receiptNumber,
      issuedAt: receipt.createdAt,
      printedAt: receipt.printedAt,
      client: client
        ? {
            name: client.name,
            dni: client.dni,
            phone: client.phone,
            address: client.address
          }
        : null,
      motorcycle: motorcycle
        ? {
            brand: motorcycle.brand,
            model: motorcycle.model,
            year: motorcycle.year,
            domain: motorcycle.domain,
            color: motorcycle.color
          }
        : null,
      sale: sale
        ? {
            id: sale.id,
            saleNumber: sale.saleNumber,
            saleDate: sale.saleDate,
            salePrice: sale.salePrice,
            downPayment: sale.downPayment,
            financedAmount: sale.financedAmount
          }
        : null,
      installment: installment
        ? {
            number: installment.number,
            amount: installment.amount,
            dueDate: installment.dueDate,
            paidAt: installment.paidAt
          }
        : null,
      payment: payment
        ? {
            amount: payment.amount,
            expectedAmount: payment.expectedAmount,
            carriedBalance: payment.carriedBalance,
            balanceAllocation: payment.balanceAllocation,
            interestRate: payment.interestRate,
            interestAmount: payment.interestAmount,
            method: payment.method,
            paidAt: payment.paidAt,
            notes: payment.notes
          }
        : null,
      collector: collector
        ? {
            name: collector.name,
            email: collector.email
          }
        : null
    };
  }
}
