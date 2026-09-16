import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Cleaning test data...");

  await prisma.answer.deleteMany();

  await prisma.interviewResult.deleteMany();

  await prisma.interviewQuestion.deleteMany();

  await prisma.interview.deleteMany();

  await prisma.user.deleteMany();

  console.log("All test data deleted successfully.");
}

main()
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });