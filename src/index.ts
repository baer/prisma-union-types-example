import { PrismaClient } from "@prisma/client";
import { getEvent } from "./get-event";

const prisma = new PrismaClient();

async function main() {
  const event = await getEvent(1);
  console.log(event);
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
