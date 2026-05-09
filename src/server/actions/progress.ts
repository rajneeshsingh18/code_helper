"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ProgressStatus } from "@prisma/client";

export async function toggleBookmark(problemId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be logged in to bookmark problems");
  }

  const userId = session.user.id;

  const existingBookmark = await db.bookmark.findUnique({
    where: {
      userId_problemId: {
        userId,
        problemId,
      },
    },
  });

  if (existingBookmark) {
    await db.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });
  } else {
    await db.bookmark.create({
      data: {
        userId,
        problemId,
      },
    });
  }

  revalidatePath(`/problems`);
  revalidatePath(`/problems/[slug]`);
}

export async function updateProgress(problemId: string, status: ProgressStatus, code?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be logged in to track progress");
  }

  const userId = session.user.id;

  await db.userProgress.upsert({
    where: {
      userId_problemId: {
        userId,
        problemId,
      },
    },
    update: {
      status,
      code,
      lastAttempt: new Date(),
    },
    create: {
      userId,
      problemId,
      status,
      code,
      lastAttempt: new Date(),
    },
  });

  revalidatePath(`/problems`);
  revalidatePath(`/problems/[slug]`);
  revalidatePath(`/dashboard`);
  revalidatePath(`/sheets/[slug]`);
}
