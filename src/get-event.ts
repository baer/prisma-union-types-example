import { PrismaClient, Concert, Play, Conference } from "@prisma/client";

type Event = Concert | Play | Conference;

const prisma = new PrismaClient();

async function getEvent(id: number): Promise<Event | null> {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      concert: true,
      play: true,
      conference: true,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // As of April, 2023, it is not possble to collapse data at the DB level
  // using Prisma
  const { concert, play, conference, ...rest } = event;
  if (concert) {
    return { ...concert, ...rest } as Concert;
  } else if (play) {
    return { ...play, ...rest } as Play;
  } else if (conference) {
    return { ...conference, ...rest } as Conference;
  }

  throw new Error("Unknown event type");
}

export { Event, getEvent };
