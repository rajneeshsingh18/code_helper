import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getDashboardStats = unstable_cache(
  async () => {
    const [allProblems, allTopics, allSheets, easyCount, mediumCount, hardCount] = await Promise.all([
      db.problem.count(),
      db.topic.count(),
      db.topicSheet.count(),
      db.problem.count({ where: { difficulty: "Easy" } }),
      db.problem.count({ where: { difficulty: "Medium" } }),
      db.problem.count({ where: { difficulty: "Hard" } }),
    ]);

    return {
      allProblems,
      allTopics,
      allSheets,
      counts: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
      }
    };
  },
  ["dashboard-global-stats"],
  { revalidate: 3600, tags: ["problems", "topics", "sheets"] }
);

export const getUserProgressStats = async (userId: string) => {
  const [totalSolved, solvedStats] = await Promise.all([
    db.userProgress.count({ where: { userId, status: "Solved" } }),
    db.userProgress.findMany({
      where: { userId, status: "Solved" },
      include: { problem: { select: { difficulty: true } } },
    })
  ]);

  const easySolved = solvedStats.filter(s => s.problem.difficulty === "Easy").length;
  const mediumSolved = solvedStats.filter(s => s.problem.difficulty === "Medium").length;
  const hardSolved = solvedStats.filter(s => s.problem.difficulty === "Hard").length;

  return {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
  };
};

export const getRecentActivity = async (userId: string, limit: number = 10) => {
  const [progress, notes, bookmarks] = await Promise.all([
    db.userProgress.findMany({
      where: { userId },
      include: { problem: { select: { title: true, slug: true } } },
      orderBy: { updatedAt: "desc" },
      take: limit,
    }),
    db.userNote.findMany({
      where: { userId },
      include: { problem: { select: { title: true, slug: true } } },
      orderBy: { updatedAt: "desc" },
      take: limit,
    }),
    db.bookmark.findMany({
      where: { userId },
      include: { problem: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);

  const activity = [
    ...progress.map((p) => ({
      id: p.id,
      type: "PROGRESS" as const,
      status: p.status,
      problemTitle: p.problem.title,
      problemSlug: p.problem.slug,
      date: p.updatedAt,
    })),
    ...notes.map((n) => ({
      id: n.id,
      type: "NOTE" as const,
      problemTitle: n.problem.title,
      problemSlug: n.problem.slug,
      date: n.updatedAt,
    })),
    ...bookmarks.map((b) => ({
      id: b.id,
      type: "BOOKMARK" as const,
      problemTitle: b.problem.title,
      problemSlug: b.problem.slug,
      date: b.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);

  return activity;
};
