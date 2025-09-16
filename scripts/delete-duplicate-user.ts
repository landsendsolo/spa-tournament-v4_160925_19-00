import prisma from '../../src/lib/prisma';

async function deleteDuplicateUser() {
  try {
    console.log('Deleting duplicate Mark Lockhart...');
    await prisma.user.delete({
      where: { id: 'caa53362-30be-4ed7-9424-9748c412c7f2' }
    });
    console.log('Duplicate Mark Lockhart deleted.');
  } catch (error) {
    console.error('Error deleting duplicate:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteDuplicateUser();
