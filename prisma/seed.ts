import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Adventurer',
      image: '/avatar.svg',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Explorer',
      image: '/avatar.svg',
    },
  });

  // Create sample posts
  const post1 = await prisma.post.upsert({
    where: { slug: 'first-adventure' },
    update: {},
    create: {
      slug: 'first-adventure',
      title: 'My First Adventure in Pixel Kingdom',
      excerpt: 'A tale of bravery and discovery',
      content: '# My First Adventure\n\nThis was my first adventure in the Pixel Kingdom. I met many interesting characters and discovered hidden treasures.',
      authorId: alice.id,
      author: alice,
      published: true,
      date: new Date('2024-01-15'),
      tags: ['adventure', 'pixel', 'kingdom'],
      views: 127,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: 'the-golden-castle' },
    update: {},
    create: {
      slug: 'the-golden-castle',
      title: 'The Golden Castle Quest',
      excerpt: 'Finding the legendary golden castle',
      content: '# The Golden Castle Quest\n\nAfter many trials and tribulations, I finally found the legendary Golden Castle hidden deep within the Pixel Kingdom.',
      authorId: bob.id,
      author: bob,
      published: true,
      date: new Date('2024-01-20'),
      tags: ['quest', 'castle', 'gold'],
      views: 89,
    },
  });

  // Create sample comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'Great adventure! I loved reading about your journey.',
        postId: post1.id,
        userId: bob.id,
        userName: bob.name,
        userImage: bob.image || '/avatar.svg',
        createdAt: new Date('2024-01-16'),
      },
      {
        content: 'Amazing story! Can\'t wait for your next adventure.',
        postId: post2.id,
        userId: alice.id,
        userName: alice.name,
        userImage: alice.image || '/avatar.svg',
        createdAt: new Date('2024-01-21'),
      },
    ],
  });

  // Create sample likes
  await prisma.like.createMany({
    data: [
      { postId: post1.id, userId: bob.id, createdAt: new Date('2024-01-16') },
      { postId: post2.id, userId: alice.id, createdAt: new Date('2024-01-21') },
    ],
  });

  console.log('Database seeded successfully!');
  console.log({ users: [alice, bob], posts: [post1, post2] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
