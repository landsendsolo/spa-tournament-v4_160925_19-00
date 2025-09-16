import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
    // --- IMPORTANT ---
    // 1. Change this to YOUR admin email address.
    const adminEmail = "admin@example.com";
    // 2. Change this to the NEW password you want to use.
    const newPassword = "250765";
    // ------------------
    console.log(`Searching for admin user: ${adminEmail}...`);
    const adminUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (!adminUser) {
        console.error(`Error: Admin user with email "${adminEmail}" not found.`);
        return;
    }
    console.log("Admin user found. Hashing new password...");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { email: adminEmail },
        data: { passwordHash: hashedPassword },
    });
    console.log("✅ Admin password has been successfully reset.");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
