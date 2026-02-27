// Prisma Configuration for Next.js + Supabase
import 'dotenv/config'
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'tsx prisma/seed.ts',
  },
  // Use DIRECT_URL for migrations (non-pooled connection on port 5432)
  datasource: {
    url: env("DIRECT_URL"),
  },
});
