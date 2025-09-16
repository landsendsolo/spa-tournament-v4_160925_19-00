"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma, User } from "@prisma/client"; // Import the User type
import { revalidatePath } from "next/cache";

// Pre-approved player map
const playerMap = new Map<string, { mobile: string; code: string }>([
  ["andy lammie", { mobile: "07920115853", code: "7SS81N" }],
  ["andy moffat", { mobile: "07376135923", code: "7TJ9FR" }],
  ["callum brown", { mobile: "07909957995", code: "JJYSQT" }],
  ["dan thom", { mobile: "07734859989", code: "8G2G1P" }],
  ["daniel wylie", { mobile: "07787426226", code: "LP7U9Q" }],
  ["gavin hunter", { mobile: "07494795635", code: "3K7S0U" }],
  ["graham campbell", { mobile: "07780912377", code: "IK9AP2" }],
  ["jayde devlin", { mobile: "07901730898", code: "IVJT9H" }],
  ["jonny robertson", { mobile: "07749403710", code: "FXC0DK" }],
  ["kevin galligan", { mobile: "07530560632", code: "G704C2" }],
  ["mark lockhart", { mobile: "07479868816", code: "BCS6U8" }],
  ["nathan maloney", { mobile: "07841570461", code: "U3NST9" }],
  ["neil cochrane", { mobile: "07386389217", code: "GI4KMF" }],
  ["owen bruce", { mobile: "07379926426", code: "X2PKU0" }],
  ["paul hamilton", { mobile: "07530282287", code: "I90P0T" }],
  ["paul harkness", { mobile: "07955904412", code: "JRNE9H" }],
  ["ross hutchison", { mobile: "07808118980", code: "ILYXOU" }],
  ["ross turley", { mobile: "07827933305", code: "WZVXKK" }],
  ["sandy drysdale", { mobile: "07971486652", code: "9ZDEPW" }],
  ["scott johnston", { mobile: "07769804891", code: "ZH3DBL" }],
  ["sean trainor", { mobile: "07874761436", code: "6SJ1JT" }],
  ["steven couper", { mobile: "07950576369", code: "ZFSKX0" }],
  ["steven griggs", { mobile: "07706143829", code: "M97HW0" }],
  ["steven kirkpatrick", { mobile: "07729513787", code: "E8JL8J" }],
  ["stevie stores", { mobile: "07920855624", code: "9ERLGC" }],
  ["tam corsan", { mobile: "07810663947", code: "X5KD78" }],
  ["test player", { mobile: "07000000000", code: "TESTER" }],
]);

export type ActionState =
  | { error: string; success?: undefined }
  | { success: string; error?: undefined };

export async function registerPlayer(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const mobile = formData.get("mobile") as string;
  const password = formData.get("password") as string;
  const code = formData.get("code") as string;

  // Input validation
  if (!name || !mobile || !password || !code) {
    return { error: "All fields are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }
  const mobileRegex = /^07\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    return { error: "Please enter a valid UK mobile number starting with 07." };
  }

  try {
    const normalizedName = name.trim().toLowerCase();
    const approved = playerMap.get(normalizedName);
    if (!approved) {
      return { error: "This player is not eligible for registration." };
    }
    if (approved.mobile !== mobile) {
      return {
        error:
          "The mobile number does not match the one on file for this player.",
      };
    }
    if (approved.code !== code) {
      return { error: "The registration code is incorrect." };
    }

    // --- THIS IS THE FINAL FIX ---
    // Use a raw, parameterized query to perform a case-insensitive search in SQLite.
    // This is safe from SQL injection.
    const existingUsers = await prisma.$queryRaw<User[]>`
      SELECT * FROM "User"
      WHERE name = ${name.trim()} COLLATE NOCASE
         OR mobile = ${approved.mobile}
    `;
    const existingUser = existingUsers[0] || null;
    // --- END OF FIX ---

    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingUser && !existingUser.passwordHash) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { passwordHash: hashedPassword, mobile: approved.mobile },
      });
    } else if (!existingUser) {
      await prisma.user.create({
        data: {
          name: name.trim(),
          mobile: approved.mobile,
          passwordHash: hashedPassword,
          role: "PLAYER",
          player: {
            create: {},
          },
        },
      });
    } else {
      return { error: "This player is already registered. Please sign in." };
    }

    revalidatePath("/");
    return { success: "Registration successful! You can now sign in." };
  } catch (error) {
    console.error("Registration Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error:
            "This player or mobile number is already in the system. Please sign in.",
        };
      }
    }
    return { error: "An unexpected error occurred. Please try again." };
  }
}
