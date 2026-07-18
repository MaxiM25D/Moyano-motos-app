import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { createHash } from "../src/utils/bcrypt.js";

const connectionConfig = process.env.DATABASE_SSL === "true"
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: true }
    }
  : process.env.DATABASE_URL;
const prisma = new PrismaClient({ adapter: new PrismaPg(connectionConfig) });

const confirmation = "RESET_MOYANO_MOTOS";
const statusOnly = process.argv.includes("--status");

const getCounts = async () => ({
  users: await prisma.user.count(),
  clients: await prisma.client.count(),
  motorcycles: await prisma.motorcycle.count(),
  sales: await prisma.sale.count(),
  installments: await prisma.installment.count(),
  payments: await prisma.payment.count(),
  receipts: await prisma.receipt.count()
});

try {
  const before = await getCounts();

  if (statusOnly) {
    console.log(JSON.stringify({ counts: before }, null, 2));
    process.exitCode = 0;
  } else {
    if (process.env.RESET_DATABASE_CONFIRM !== confirmation) {
      throw new Error(`Reset cancelado. Define RESET_DATABASE_CONFIRM=${confirmation}`);
    }

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || "Administrador";

    if (!email || !password || password.length < 8) {
      throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD (minimo 8 caracteres) son obligatorios");
    }

    const admin = await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        'TRUNCATE TABLE "Receipt", "Payment", "Installment", "Sale", "Motorcycle", "Client", "User" RESTART IDENTITY CASCADE'
      );

      return tx.user.create({
        data: {
          name,
          email,
          password: createHash(password),
          role: "ADMIN",
          active: true
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true
        }
      });
    });

    const after = await getCounts();
    console.log(JSON.stringify({ before, after, admin }, null, 2));
  }
} finally {
  await prisma.$disconnect();
}
