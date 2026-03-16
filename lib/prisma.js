import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis;

function createPrismaClient() {
  let url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  // Adapter expects mariadb:// scheme (Prisma often uses mysql://)
  url = url.replace(/^mysql:\/\//i, "mariadb://");
  // Empty password "user:@" can break parser; use "user@"
  url = url.replace(/^mariadb:\/\/([^:]+):@/, "mariadb://$1@");
  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}