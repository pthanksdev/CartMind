import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL Database connected via Prisma!");
    } catch (error) {
        console.error("Database connection error (non-fatal):", error);
    }
};