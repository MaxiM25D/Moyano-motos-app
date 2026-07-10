import { prisma } from "./prisma.client.js";

export const connectAuto = async () => {
  try {
    await prisma.$connect();
    console.log("Conectado a PostgreSQL con Prisma.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
