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
      }),
      prisma.sale.findMany({
        where: { status: "ACTIVE" },
        select: { clientId: true },
        distinct: ["clientId"]
      }),
      prisma.sale.findMany({
        where: {
          status: "ACTIVE",
          installments: {
            some: {
              payment: {
                is: {
                  paidAt: {
                    gte: from,
                    lt: to
                  }
                }
              }
            }
          }
        },
        select: { clientId: true },
        distinct: ["clientId"]
      })
    ];
  }

  getCollections(from, to, skip, take) {
    return prisma.payment.findMany({
      where: {
        paidAt: {
          gte: from,
          lte: to
        }
      },
      skip,
      take,
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

  getCollectionsByMethod(from, to) {
    return prisma.payment.groupBy({
      by: ["method"],
      where: { paidAt: { gte: from, lte: to } },
      _sum: { amount: true }
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

  getOverdueInstallments(today, skip, take) {
    return prisma.installment.findMany({
      where: {
        status: "PENDING",
        dueDate: { lt: today }
      },
      skip,
      take,
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

  getOverdueTotal(today) {
    return prisma.installment.aggregate({
      where: { status: "PENDING", dueDate: { lt: today } },
      _sum: { amount: true },
      _count: { id: true }
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
