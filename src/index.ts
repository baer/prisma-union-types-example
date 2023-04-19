import { PrismaClient } from "@prisma/client";
import { findUniqueEvent, findManyEvents } from "./custom-models/event";

const prisma = new PrismaClient();

async function main() {
  // const event = await findUniqueEvent(1);
  const allEvents = await findManyEvents();

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
