import { PrismaClient } from "@prisma/client";
import { getEvent, getEvents } from "./get-event";

const prisma = new PrismaClient();

async function main() {
  // const event = await getEvent(1);
  const allEvents = await getEvents();

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
