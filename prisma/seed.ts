import { PrismaClient, RoomStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const generateUsername = (n: number): string[] => {
  const words1 = ['Shadow', 'Neon', 'Void', 'Ghost', 'Cyber', 'Frost', 'Blade', 'Nova', 'Echo', 'Flux'];

  const words2 = ['Rider', 'Hunter', 'Killer', 'Walker', 'Player', 'Sniper', 'Runner', 'Master', 'Slayer', 'Pilot'];

  const result = new Set<string>();

  while (result.size < n) {
    const w1 = words1[Math.floor(Math.random() * words1.length)];
    const w2 = words2[Math.floor(Math.random() * words2.length)];
    const num = Math.floor(Math.random() * 10000);

    const username = `${w1}${w2}${num}`;
    result.add(username);
  }

  return Array.from(result);
};

const generateRoomName = (n: number) => {
  const vibes = ['Neon', 'Dark', 'Toxic', 'Chill', 'Savage', 'Cyber', 'Shadow', 'Epic', 'Ghost', 'Hardcore'];

  const types = ['Room', 'Arena', 'Lobby', 'Zone', 'Base', 'Hub', 'Den', 'Lounge', 'Core', 'Nexus'];

  const tags = ['PvP', 'Squad', 'Only', 'Noob', 'Pro', '24/7', 'Rush', 'Clutch'];

  const result = new Set<string>();

  while (result.size < n) {
    const v = vibes[Math.floor(Math.random() * vibes.length)];
    const t = types[Math.floor(Math.random() * types.length)];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    const num = Math.floor(Math.random() * 1000);

    const roomName = `${v} ${t} ${tag} ${num}`;
    result.add(roomName);
  }

  return Array.from(result);
};

async function main() {
  console.log('🌱 Starting seed...');

  // Очистка базы данных
  await prisma.token.deleteMany();
  await prisma.playerRoomStats.deleteMany();
  await prisma.roomStats.deleteMany();
  await prisma.player.deleteMany();
  await prisma.game.deleteMany();
  await prisma.room.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleared');

  // // Хешируем пароли
  const hashedPassword = await bcrypt.hash('password123', Number(process.env.CRYPT_SALT ?? 10));
  const roomHashedPassword = await bcrypt.hash('room123', Number(process.env.CRYPT_SALT ?? 10));
  const rootHashedPassword = await bcrypt.hash('rootroot', Number(process.env.CRYPT_SALT ?? 10));
  //
  // Создаём пользователей
  const usernames = generateUsername(40);

  const users = await Promise.all(
    new Array(40).fill(0).map((_, index) =>
      prisma.user.create({
        data: {
          username: usernames[index],
          password: hashedPassword,
        },
      })
    )
  );

  console.log(`✅ Created ${users.length} users`);

  const roomNames = generateRoomName(users.length);
  const rooms = await Promise.all(
    users.map((user, index) =>
      prisma.room.create({
        data: {
          name: roomNames[index],
          code: `test_room_${index + 1}_code`,
          maxPlayers: 4,
          currentPlayers: 1,
          isPrivate: index % 2 === 0,
          ...(index % 2 === 0 && { password: roomHashedPassword }),
          status: RoomStatus.WAITING,
          creatorId: user.id,
          roomStats: {
            create: {
              totalGames: 0,
              completedGames: 0,
            },
          },
        },
        include: { roomStats: true },
      })
    )
  );

  console.log(`✅ Created ${rooms.length} rooms`);

  const players = await Promise.all(
    rooms.map((room, index) =>
      prisma.player.create({
        data: {
          userId: users[index].id,
          roomId: room.id,
          gameId: null,
          position: 0,
          hand: [],
          penaltyCard: [],
          totalPenalty: 0,
          isReady: true,
          isWinner: false,
          finalPosition: 2,
        },
      })
    )
  );

  console.log(`✅ Created ${players.length} players`);

  await prisma.user.create({
    data: {
      username: `root`,
      password: rootHashedPassword,
    },
  });

  // const room3 = await prisma.room.create({
  //   data: {
  //     name: 'John Player room',
  //     code: 'FRIEND',
  //     maxPlayers: 4,
  //     currentPlayers: 1,
  //     isPrivate: false,
  //     status: RoomStatus.FINISHED,
  //     creatorId: users[2].id,
  //     roomStats: {
  //       create: {
  //         totalGames: 0,
  //         completedGames: 0,
  //       },
  //     },
  //   },
  // });
  //
  // await prisma.player.create({
  //   data: {
  //     userId: users[2].id,
  //     roomId: room3.id,
  //     gameId: null,
  //     position: 0,
  //     hand: [],
  //     penaltyCard: [],
  //     totalPenalty: 0,
  //     isReady: true,
  //     isWinner: false,
  //     finalPosition: 2,
  //   },
  // });
  //
  // console.log(`✅ Created "${room3.name}" with 1 player`);
  //
  // // Комната 4: Пустая комната
  // const room4 = await prisma.room.create({
  //   data: {
  //     name: 'Sarah Cards room',
  //     code: 'QUICK1',
  //     maxPlayers: 2,
  //     currentPlayers: 1,
  //     isPrivate: false,
  //     status: RoomStatus.WAITING,
  //     creatorId: users[3].id,
  //     roomStats: {
  //       create: {
  //         totalGames: 0,
  //         completedGames: 0,
  //       },
  //     },
  //   },
  // });
  //
  // await prisma.player.create({
  //   data: {
  //     userId: users[3].id,
  //     roomId: room4.id,
  //     gameId: null,
  //     position: 0,
  //     hand: [],
  //     penaltyCard: [],
  //     totalPenalty: 0,
  //     isReady: true,
  //     isWinner: false,
  //     finalPosition: 2,
  //   },
  // });
  //
  // console.log(`✅ Created room "${room4.name}" with 1 player`);
  //
  // // Комната 4: Пустая комната
  // const room5 = await prisma.room.create({
  //   data: {
  //     name: 'Mike room',
  //     code: 'mike_room',
  //     maxPlayers: 2,
  //     currentPlayers: 1,
  //     isPrivate: false,
  //     status: RoomStatus.WAITING,
  //     creatorId: users[4].id,
  //     roomStats: {
  //       create: {
  //         totalGames: 0,
  //         completedGames: 0,
  //       },
  //     },
  //   },
  // });
  //
  // await prisma.player.create({
  //   data: {
  //     userId: users[4].id,
  //     roomId: room5.id,
  //     gameId: null,
  //     position: 0,
  //     hand: [],
  //     penaltyCard: [],
  //     totalPenalty: 0,
  //     isReady: true,
  //     isWinner: false,
  //     finalPosition: 2,
  //   },
  // });
  //
  // console.log(`✅ Created room "${room5.name}" with 1 player`);
  //
  // // Создаём refresh токены для некоторых пользователей
  // await Promise.all([
  //   prisma.token.create({
  //     data: {
  //       userId: users[0].id,
  //       refreshToken: 'refresh_token_alex_' + Math.random().toString(36).substring(7),
  //     },
  //   }),
  //   prisma.token.create({
  //     data: {
  //       userId: users[1].id,
  //       refreshToken: 'refresh_token_maria_' + Math.random().toString(36).substring(7),
  //     },
  //   }),
  // ]);
  //
  // console.log('✅ Created refresh tokens');
  //
  // console.log('\n🎉 Seed completed successfully!');
  // console.log('\n📊 Summary:');
  // console.log(`   Users: ${users.length}`);
  // console.log(`   Rooms: 4`);
  // console.log(`   Games: 2 (1 in progress, 1 finished)`);
  // console.log(`   Players: ${5}`);
  // console.log('\n💡 Test credentials:');
  // console.log('   Username: alex_gaming, maria_pro, john_player, sarah_cards, mike_newbie');
  // console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
