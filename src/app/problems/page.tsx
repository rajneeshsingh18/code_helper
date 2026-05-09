import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { cn, getDifficultyColor } from "@/lib/utils";
import { ProblemFilters } from "./problem-filters";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; topic?: string; search?: string }>;
}) {
  const params = await searchParams;

  const difficulty = params.difficulty;
  const topicSlug = params.topic;
  const search = params.search || "";

  const whereClause: any = {};

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

  const problems = await db.problem.findMany({
    where: whereClause,
    include: {
      topics: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const topics = await db.topic.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const session = await getServerSession(authOptions);
  const userProgress: Record<string, string> = {};

  if (session?.user?.id) {
    const progress = await db.userProgress.findMany({
      where: { userId: session.user.id },
      select: { problemId: true, status: true },
    });
    progress.forEach((p) => {
      userProgress[p.problemId] = p.status;
    });
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Problems</h1>
          <p className="text-muted-foreground">
            Practice coding problems organized by difficulty and topics
          </p>
        </div>

        <ProblemFilters topics={topics} />

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Topics</TableHead>
                <TableHead className="w-[100px]">Video</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No problems found
                  </TableCell>
                </TableRow>
              ) : (
                problems.map((problem) => {
                  const status = userProgress[problem.id];
                  return (
                    <TableRow key={problem.id}>
                      <TableCell>
                        {status === "Solved" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : status === "Attempted" ? (
                          <PlayCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/problems/${problem.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {problem.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getDifficultyColor(problem.difficulty))}>
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {problem.topics.slice(0, 2).map((t) => (
                            <Badge key={t.id} variant="outline" className="text-xs">
                              {t.name}
                            </Badge>
                          ))}
                          {problem.topics.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{problem.topics.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {problem.videoUrl ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={problem.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}