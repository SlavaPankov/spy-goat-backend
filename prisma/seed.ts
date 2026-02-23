import { PrismaClient, RoomStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
  // const hashedPassword = await bcrypt.hash('password123', Number(process.env.CRYPT_SALT ?? 10));
  // const rootHashedPassword = await bcrypt.hash('root', Number(process.env.CRYPT_SALT ?? 10));
  //
  // // Создаём пользователей
  // const users = await Promise.all([
  //   prisma.user.create({
  //     data: {
  //       username: 'alex_gaming',
  //       password: hashedPassword,
  //     },
  //   }),
  //   prisma.user.create({
  //     data: {
  //       username: 'maria_pro',
  //       password: hashedPassword,
  //     },
  //   }),
  //   prisma.user.create({
  //     data: {
  //       username: 'john_player',
  //       password: hashedPassword,
  //     },
  //   }),
  //   prisma.user.create({
  //     data: {
  //       username: 'sarah_cards',
  //       password: hashedPassword,
  //     },
  //   }),
  //   prisma.user.create({
  //     data: {
  //       username: 'mike_newbie',
  //       password: hashedPassword,
  //     },
  //   }),
  //   prisma.user.create({
  //     data: {
  //       username: 'root',
  //       password: rootHashedPassword,
  //     },
  //   }),
  // ]);
  //
  // console.log(`✅ Created ${users.length} users with stats`);
  //
  // // Комната 1: Создатель alex_gaming
  // const room1 = await prisma.room.create({
  //   data: {
  //     name: 'Alex gaming room',
  //     code: 'PROP01',
  //     maxPlayers: 4,
  //     currentPlayers: 1,
  //     isPrivate: false,
  //     status: RoomStatus.WAITING,
  //     creatorId: users[0].id,
  //     roomStats: {
  //       create: {
  //         totalGames: 0,
  //         completedGames: 0,
  //       },
  //     },
  //   },
  //   include: { roomStats: true },
  // });
  //
  // await prisma.player.create({
  //   data: {
  //     userId: users[0].id,
  //     roomId: room1.id,
  //     gameId: null,
  //     position: 0,
  //     hand: [],
  //     penaltyCard: [],
  //     totalPenalty: 0,
  //     isReady: true,
  //   },
  // });
  //
  // console.log(`✅ Created room "${room1.name}" with 1 player`);
  //
  // // Комната 2: Ожидание игроков
  // const room2 = await prisma.room.create({
  //   data: {
  //     name: 'Maria Pro room',
  //     code: 'CASUAL',
  //     maxPlayers: 6,
  //     currentPlayers: 1,
  //     isPrivate: false,
  //     status: RoomStatus.WAITING,
  //     creatorId: users[1].id,
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
  //     userId: users[1].id,
  //     roomId: room2.id,
  //     position: 0,
  //     isReady: true,
  //   },
  // });
  //
  // console.log(`✅ Created room "${room2.name}" with 1 player and waiting for players`);
  //
  // // Комната 3: Приватная комната с завершённой игрой
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
