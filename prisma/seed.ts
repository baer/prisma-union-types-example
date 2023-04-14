import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Concert events
  const altamontFreeConcert = await prisma.event.create({
    data: {
      title: "Altamont Free Concert",
      description: "A free outdoor concert featuring top bands of the era",
      startDate: new Date("1969-12-06T00:00:00.000Z"),
      endDate: new Date("1969-12-06T23:59:59.000Z"),
      concert: {
        create: {
          artist: "The Rolling Stones, Jefferson Airplane, and others",
        },
      },
    },
  });

  const woodstock99 = await prisma.event.create({
    data: {
      title: "Woodstock '99",
      description:
        "A celebration of the 30th anniversary of the original Woodstock festival",
      startDate: new Date("1999-07-22T00:00:00.000Z"),
      endDate: new Date("1999-07-25T23:59:59.000Z"),
      concert: {
        create: {
          artist: "Various Artists",
        },
      },
    },
  });

  const fyreFestival = await prisma.event.create({
    data: {
      title: "Fyre Festival",
      description:
        "A luxury music festival featuring top artists and exclusive experiences",
      startDate: new Date("2017-04-28T00:00:00.000Z"),
      endDate: new Date("2017-04-30T23:59:59.000Z"),
      concert: {
        create: {
          artist: "Various Artists",
        },
      },
    },
  });

  // Seed Play events
  const mooseMurders = await prisma.event.create({
    data: {
      title: "Moose Murders",
      description:
        "A thrilling new Broadway play filled with mystery and suspense",
      startDate: new Date("1983-02-22T00:00:00.000Z"),
      endDate: new Date("1983-02-22T23:59:59.000Z"),
      play: {
        create: {
          playName: "Moose Murders",
          playwright: "Arthur Bicknell",
          director: "John Roach",
        },
      },
    },
  });

  const carrieTheMusical = await prisma.event.create({
    data: {
      title: "Carrie: The Musical",
      description:
        "A Broadway adaptation of Stephen King's classic novel, featuring stunning visuals and unforgettable songs",
      startDate: new Date("1988-05-12T00:00:00.000Z"),
      endDate: new Date("1988-05-15T23:59:59.000Z"),
      play: {
        create: {
          playName: "Carrie: The Musical",
          playwright: "Lawrence D. Cohen",
          director: "Terry Hands",
        },
      },
    },
  });

  // Seed Conference events
  const dashCon = await prisma.event.create({
    data: {
      title: "DashCon",
      description:
        "A fan-run convention celebrating Tumblr culture and featuring panels, workshops, and meetups",
      startDate: new Date("2014-07-11T00:00:00.000Z"),
      endDate: new Date("2014-07-13T23:59:59.000Z"),
      conference: {
        create: {
          organizer: "Tumblr users",
          numberOfSpeakers: 0,
        },
      },
    },
  });

  const tanaCon = await prisma.event.create({
    data: {
      title: "TanaCon",
      description:
        "A creator-led convention with meet and greets, panels, and exclusive merchandise",
      startDate: new Date("2018-06-22T00:00:00.000Z"),
      endDate: new Date("2018-06-23T23:59:59.000Z"),
      conference: {
        create: {
          organizer: "Tana Mongeau",
          numberOfSpeakers: 0,
        },
      },
    },
  });

  console.log({
    altamontFreeConcert,
    woodstock99,
    fyreFestival,
    mooseMurders,
    carrieTheMusical,
    dashCon,
    tanaCon,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
