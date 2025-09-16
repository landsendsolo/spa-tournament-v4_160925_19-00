import prisma from '/home/ubuntu/spa-tournament-v4-final/src/lib/prisma.ts';
import bcrypt from 'bcryptjs';
const { hash } = bcrypt;

async function setPlayerCredentials() {
  try {
    console.log('Setting credentials for players with null mobile/passwordHash...');
    const playersToUpdate = [
      { id: '464c1316-ee1a-4377-86f9-4481c1071e04', mobile: '07000000001', name: 'Steven Griggs' },
      { id: '5fe946f9-d34a-4b7a-a827-67239ef35020', mobile: '07000000002', name: 'Andy Moffat' },
      { id: '7eb5ef3e-e2f1-418c-a3fb-36eaeddbd5a6', mobile: '07000000003', name: 'Neil Cochrane' }
    ];
    const password = 'password123';
    const hashedPassword = await hash(password, 10);

    for (const player of playersToUpdate) {
      const user = await prisma.user.findUnique({ where: { id: player.id } });
      if (user && (!user.mobile || !user.passwordHash)) {
        await prisma.user.update({
          where: { id: player.id },
          data: { mobile: player.mobile, passwordHash: hashedPassword }
        });
        console.log(`Set credentials for ${player.name} (ID: ${player.id}, Mobile: ${player.mobile})`);
      } else {
        console.log(`Credentials already set for ${player.name} (ID: ${player.id})`);
      }
    }
    console.log('Credentials set completed.');
  } catch (error) {
    console.error('Error setting credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setPlayerCredentials();
