import { prisma } from "../config/db/prisma.client.js";

const receiptInclude = {
  payment: {
    include: {
      user: true,
      installment: {
        include: {
          sale: {
            include: {
              client: true,
              motorcycle: true
            }
          }
        }
      }
    }
  }
};

export class ReceiptRepository {
  getReceipts() {
    return prisma.receipt.findMany({
      include: receiptInclude,
      orderBy: { createdAt: "desc" }
    });
  }

  getReceiptById(id) {
    return prisma.receipt.findUnique({
      where: { id: Number(id) },
      include: receiptInclude
    });
  }

  getReceiptByPaymentId(paymentId) {
    return prisma.receipt.findUnique({
      where: { paymentId: Number(paymentId) },
      include: receiptInclude
    });
  }

  getPaymentById(paymentId) {
    return prisma.payment.findUnique({
      where: { id: Number(paymentId) }
    });
  }

  createReceipt(paymentId, receiptNumber) {
    return prisma.receipt.create({
      data: {
        paymentId: Number(paymentId),
        receiptNumber
      },
      include: receiptInclude
    });
  }

  markAsPrinted(id) {
    return prisma.receipt.update({
      where: { id: Number(id) },
      data: { printedAt: new Date() },
      include: receiptInclude
    });
  }
}
