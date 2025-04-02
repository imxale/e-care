import { PrismaClient } from "@prisma/client";

// Éviter les instances multiples du client Prisma pendant le hot reloading en développement
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
