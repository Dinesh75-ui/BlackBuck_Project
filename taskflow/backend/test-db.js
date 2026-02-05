import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Testing database connection...");
        console.log("DATABASE_URL:", process.env.DATABASE_URL); // CAREFUL: This prints the password locally.
        await prisma.$connect();
        console.log("Successfully connected to database!");
        const count = await prisma.user.count();
        console.log(`Found ${count} users.`);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
