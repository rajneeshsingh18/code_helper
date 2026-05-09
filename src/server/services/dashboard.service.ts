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
