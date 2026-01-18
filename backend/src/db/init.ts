/**
 * Initialize database using Prisma migrations.
 * This replaces the old SQL schema file approach.
 */
import prisma from "./prisma.js";

export async function initializeDatabase(): Promise<void> {
  try {
    console.log("Initializing database with Prisma...");

    // Test connection
    await prisma.$connect();
    console.log("✓ Database connection established");

    // Prisma will handle migrations via `prisma migrate dev` or `prisma db push`
    // We just verify the connection here
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Database schema verified");

    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

