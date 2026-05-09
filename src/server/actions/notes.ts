"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveUserNote(problemId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be logged in to save notes");
  }

  const userId = session.user.id;

  await db.userNote.upsert({
    where: {
      userId_problemId: {
        userId,
        problemId,
      },
    },
    update: {
      content,
    },
    create: {
      userId,
      problemId,
      content,
    },
  });

  revalidatePath(`/problems/[slug]`, "page");
}
