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
  async getReceipts({ where, skip, take }) {
    const [receipts, total] = await prisma.$transaction([
      prisma.receipt.findMany({
        where,
        include: receiptInclude,
        skip,
        take,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }]
      }),
      prisma.receipt.count({ where })
    ]);

    return { receipts, total };
  }

  async getPaymentsWithoutReceipt({ where, skip, take }) {
    const [installments, total] = await prisma.$transaction([
      prisma.installment.findMany({
        where,
        include: {
          payment: { include: { receipt: true } },
          sale: { include: { client: true, motorcycle: true } }
        },
        skip,
        take,
        orderBy: [{ paidAt: "desc" }, { id: "desc" }]
      }),
      prisma.installment.count({ where })
    ]);

    return { installments, total };
  }

  async getReceiptSummary() {
    const pendingWhere = {
      status: "PAID",
      payment: { is: { receipt: { is: null } } }
    };
    const [issued, printed, pending] = await prisma.$transaction([
      prisma.receipt.count(),
      prisma.receipt.count({ where: { printedAt: { not: null } } }),
      prisma.installment.count({ where: pendingWhere })
    ]);

    return { issued, printed, pending };
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
