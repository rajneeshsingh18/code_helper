import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

import { Prisma } from "@prisma/client";

export const getProblems = unstable_cache(
  async (difficulty?: string, topicSlug?: string, search?: string) => {
    const whereClause: Prisma.ProblemWhereInput = {};

    if (difficulty && difficulty !== "all") {
      whereClause.difficulty = difficulty;
    }

    if (topicSlug && topicSlug !== "all") {
      whereClause.topics = {
        some: {
          slug: topicSlug,
        },
      };
    }

    if (search) {
      whereClause.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    return db.problem.findMany({
      where: whereClause,
      include: {
        topics: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  ["problems-list"],
  { revalidate: 3600, tags: ["problems"] }
);

export const getProblemBySlug = unstable_cache(
  async (slug: string) => {
    return db.problem.findUnique({
      where: { slug },
      include: {
        topics: true,
      },
    });
  },
  ["problem-detail"],
  { revalidate: 3600, tags: ["problems"] }
);

export const getTopics = unstable_cache(
  async () => {
    return db.topic.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
  },
  ["topics-list"],
  { revalidate: 86400, tags: ["topics"] }
);
