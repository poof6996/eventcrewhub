import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma Client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient instance if one doesn't already exist in the global scope.
// This prevents creating multiple instances during hot-reloading in development.
const client = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = client;
}

// ✅ Export the instance as a named export
export const prisma = client;
