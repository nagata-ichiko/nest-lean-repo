import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  //   const alice = await prisma.user.findUnique({
  //     where: { email: 'alice@example.com' },
  //   });

  //   console.log(alice);

  //   const users = await prisma.user.findMany();

  //   console.log(users);

  //   const bob = await prisma.user.findUnique({
  //     where: { email: 'bob@example.com' },
  //     include: { posts: true },
  //   });

  //   console.log(bob);

  //   const posts = await prisma.post.findMany({
  //     where: {
  //       title: {
  //         startsWith: 'title',
  //       },
  //     },
  //     take: 5,
  //     orderBy: {
  //       id: 'asc',
  //     },
  //     include: { author: true },
  //   });

  //   console.log(posts);

  const john = await prisma.user.create({
    data: {
      name: 'john',
      email: 'john@exsample.com',
      profile: {
        create: {
          bio: 'I like turtles',
        },
      },
    },
  });

  console.log(john);

  const [user, post, totalPosts] = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: 'mike',
        email: 'mike@example.com',
        profile: {
          create: {
            bio: 'I like turtles',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: 'mike',
        email: 'mike@example.com',
        profile: {
          create: {
            bio: 'I like turtles',
          },
        },
      },
    }),
    prisma.user.count(),
  ]);

  console.log(user, post, totalPosts);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
