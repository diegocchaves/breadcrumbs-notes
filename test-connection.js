import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("✅ Database connection successful!", result);
    console.log("📊 Your database is reachable and working!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.error("\n🔍 Check your DATABASE_URL in .env file");
  } finally {
    await prisma.$disconnect();
  }
}

main();
