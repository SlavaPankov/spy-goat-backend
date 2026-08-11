import { PrismaClient, FriendshipStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const TOTAL_NOTIFICATIONS = 70;
const POOL_SIZE = 20;

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60_000);
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

async function upsertDemoUser(username: string) {
  const password = await bcrypt.hash('password123', Number(process.env.CRYPT_SALT ?? 10));

  return prisma.user.upsert({
    where: { username },
    update: {},
    create: { username, password },
  });
}

function toFriendUser(user: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null }) {
  return { id: user.id, username: user.username, isOnline: user.isOnline, lastSeenAt: user.lastSeenAt };
}

async function main() {
  console.log('🌱 Seeding demo notifications...');

  const me = await upsertDemoUser('demo_me');

  const pool = await Promise.all(Array.from({ length: POOL_SIZE }, (_, i) => upsertDemoUser(`demo_user_${i + 1}`)));

  const demoUserIds = [me.id, ...pool.map((u) => u.id)];

  await prisma.notification.deleteMany({ where: { userId: { in: demoUserIds } } });
  await prisma.friendship.deleteMany({
    where: { OR: [{ requesterId: { in: demoUserIds } }, { addresseeId: { in: demoUserIds } }] },
  });

  const friendships = await Promise.all(
    pool.map((user, i) => {
      const iAmAddressee = i % 2 === 0;
      const status = i % 3 === 0 ? FriendshipStatus.PENDING : FriendshipStatus.ACCEPTED;

      return prisma.friendship.create({
        data: {
          requesterId: iAmAddressee ? user.id : me.id,
          addresseeId: iAmAddressee ? me.id : user.id,
          status,
        },
      });
    })
  );

  const notifications: Prisma.NotificationCreateManyInput[] = Array.from({ length: TOTAL_NOTIFICATIONS }, () => {
    const friendship = pick(friendships);
    const otherUserId = friendship.requesterId === me.id ? friendship.addresseeId : friendship.requesterId;
    const otherUser = pool.find((u) => u.id === otherUserId)!;

    const type = friendship.status === FriendshipStatus.PENDING ? 'FRIEND_REQUEST' : 'FRIEND_ACCEPTED';

    return {
      userId: me.id,
      type,
      payload: { friendshipId: friendship.id, otherUser: toFriendUser(otherUser) } as Prisma.InputJsonValue,
      createdAt: daysAgo(randomInt(0, 45)),
      readAt: null,
    };
  });

  await prisma.notification.createMany({ data: notifications });

  console.log(`✅ Seeded ${TOTAL_NOTIFICATIONS} unread notifications for "${me.username}"`);
  console.log(`   Пул пользователей: ${pool.length}, Friendship-записей: ${friendships.length}`);
  console.log(`   Логин: ${me.username} / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Notification seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
