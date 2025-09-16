"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ActionState =
  | { error: string; success?: undefined }
  | { success: string; error?: undefined };

export async function arrangeMatch(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to perform this action." };
  }

  const matchId = formData.get("matchId") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const location = formData.get("location") as string;

  if (!matchId || !date || !time || !location) {
    return { error: "All fields are required." };
  }

  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return { error: "Match not found." };
    }

    // Security check: ensure the current user is one of the players
    const player = await prisma.player.findUnique({
      where: { userId: session.user.id },
    });
    if (
      !player ||
      (match.player1Id !== player.id && match.player2Id !== player.id)
    ) {
      return { error: "You are not authorized to arrange this match." };
    }

    // Combine date and time into a single ISO string for the DateTime field
    const scheduledTime = new Date(`${date}T${time}`);

    await prisma.match.update({
      where: { id: matchId },
      data: {
        scheduledTime,
        location,
      },
    });

    // Revalidate paths to ensure the UI updates
    revalidatePath("/dashboard");
    revalidatePath("/matches");

    return { success: "Match has been successfully arranged!" };
  } catch (error) {
    console.error("Arrange Match Error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
