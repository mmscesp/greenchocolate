// Prisma Client Singleton for Next.js
// Prevents multiple instances during hot reload

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getServerEnv } from '@/lib/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create PrismaClient with PostgreSQL adapter for Prisma 7
const createPrismaClient = () => {
  const env = getServerEnv();
  const connectionString = env.DATABASE_URL;
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (getServerEnv().NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
