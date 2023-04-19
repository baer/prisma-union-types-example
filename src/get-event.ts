import {
  Prisma,
  PrismaClient,
  Concert,
  Play,
  Conference,
} from "@prisma/client";

type DBEvent = {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  title: string;
  description: string;
  startDate: Date;
  endDate: Date;

  concert?: Concert | null;
  play?: Play | null;
  conference?: Conference | null;
};

type Event = Concert | Play | Conference;

const prisma = new PrismaClient();

function castEvent(event: DBEvent) {
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

async function findUniqueEvent(
  id: number,
  findUniqueArgs?: Prisma.EventFindUniqueArgs
): Promise<Event | null> {
  const event: DBEvent | null = await prisma.event.findUnique({
    ...findUniqueArgs,
    where: {
      ...findUniqueArgs?.where,
      id,
    },
    include: {
      ...findUniqueArgs?.include,
      concert: true,
      play: true,
      conference: true,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return castEvent(event);
}

async function findManyEvents(findManyArgs?: Prisma.EventFindManyArgs) {
  const events = await prisma.event.findMany({
    ...findManyArgs,
    include: {
      ...findManyArgs?.include,
      concert: true,
      play: true,
      conference: true,
    },
  });

  return events.map(castEvent);
}

export { Event, findUniqueEvent, findManyEvents };
