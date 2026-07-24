import { prisma } from "../config/db/prisma.client.js";

export class ReportRepository {
  getDashboard({ from, to, today }) {
    const installmentSaleInclude = {
      sale: {
        include: {
          client: true,
          motorcycle: true
        }
      }
    };

    return [
      prisma.payment.aggregate({
        where: {
          paidAt: {
            gte: from,
            lt: to
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.installment.aggregate({
        where: {
          status: "PENDING",
          dueDate: {
            gte: today,
            lt: to
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.installment.aggregate({
        where: {
          status: "PENDING",
          dueDate: {
            gte: from,
            lt: today
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.installment.findMany({
        where: {
          status: "PENDING",
          dueDate: { gte: today }
        },
        include: installmentSaleInclude,
        orderBy: { dueDate: "asc" },
        take: 5
      }),
      prisma.installment.findMany({
        where: {
          status: "PENDING",
          dueDate: {
            gte: from,
            lt: today
          }
        },
        include: installmentSaleInclude,
        orderBy: { dueDate: "asc" },
        take: 5
      })
    ];
  }

  getCollections(from, to) {
    return prisma.payment.findMany({
      where: {
        paidAt: {
          gte: from,
          lte: to
        }
      },
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
      },
      orderBy: { paidAt: "desc" }
    });
  }

  getCollectionsTotal(from, to) {
    return prisma.payment.aggregate({
      where: {
        paidAt: {
          gte: from,
          lte: to
        }
      },
      _sum: { amount: true },
      _count: { id: true }
    });
  }

  getOverdueInstallments(today) {
    return prisma.installment.findMany({
      where: {
        status: "PENDING",
        dueDate: { lt: today }
      },
      include: {
        sale: {
          include: {
            client: true,
            motorcycle: true
          }
        }
      },
      orderBy: { dueDate: "asc" }
    });
  }

  getDebtSummary(today) {
    return Promise.all([
      prisma.installment.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.installment.aggregate({
        where: {
          status: "PENDING",
          dueDate: { lt: today }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.installment.aggregate({
        where: {
          status: "PENDING",
          dueDate: { gte: today }
        },
        _sum: { amount: true },
        _count: { id: true }
      })
    ]);
  }

  getSalesSummary(from, to) {
    return prisma.sale.aggregate({
      where: {
        saleDate: {
          gte: from,
          lte: to
        }
      },
      _sum: {
        salePrice: true,
        downPayment: true,
        financedAmount: true
      },
      _count: { id: true }
    });
  }
}
