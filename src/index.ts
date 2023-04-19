import { PrismaClient } from "@prisma/client";
import { findUnique, findMany } from "./custom-models/event";

const prisma = new PrismaClient();

async function main() {
  // const event = await findUnique(1);
  const allEvents = await findMany();

  console.log(allEvents);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
