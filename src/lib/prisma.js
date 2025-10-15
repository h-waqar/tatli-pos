import { PrismaClient } from "@prisma/client";

// Singleton pattern to prevent multiple instances of Prisma Client in development
// Next.js uses hot module reloading, which can create many instances of PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient();
};

const prisma = global.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
