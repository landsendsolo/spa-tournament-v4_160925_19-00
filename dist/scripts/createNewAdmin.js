import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  // --- IMPORTANT: CONFIGURE THIS SECTION ---
  // 1. Enter the email of the OLD admin user you want to DELETE.
  //    (Use the email you found in the database earlier).
  const oldAdminEmail = "admin@example.com";
  // 2. Enter the details for the NEW admin user you want to CREATE.
  const newAdmin = {
    name: "Your Admin Name",
    email: "your-new-admin-email@example.com",
    password: "your-new-strong-password",
  };
  // -----------------------------------------
  // Try to delete the old admin user
  try {
    console.log(`Attempting to delete old admin user: ${oldAdminEmail}...`);
    const deletedUser = await prisma.user.delete({
      where: { email: oldAdminEmail },
    });
    console.log(`Successfully deleted old user: ${deletedUser.email}`);
  } catch (error) {
    console.warn(`Could not delete old admin user (they may not exist).`);
  }
  // Create the new admin user
  console.log(`Creating new admin user: ${newAdmin.email}...`);
  const hashedPassword = await bcrypt.hash(newAdmin.password, 10);
  await prisma.user.create({
    data: {
      name: newAdmin.name,
      email: newAdmin.email,
      passwordHash: hashedPassword, // Uses the correct field name
      role: Role.ADMIN,
    },
  });
  console.log("✅ New admin user created successfully.");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
