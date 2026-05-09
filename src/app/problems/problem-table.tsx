"use client";

import { useState, useEffect, useCallback } from "react";
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
import { CheckCircle2, Circle, PlayCircle, Loader2 } from "lucide-react";
import { cn, getDifficultyColor } from "@/lib/utils";
import { fetchMoreProblems } from "@/server/actions/problems";
import { useInView } from "react-intersection-observer";

interface Topic {
  id: string;
  name: string;
  slug: string;
}

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  videoUrl?: string | null;
  topics: Topic[];
}

interface ProblemTableProps {
  initialProblems: Problem[];
  userProgress: Record<string, string>;
  filters: {
    difficulty?: string;
    topic?: string;
    search?: string;
  };
}

export function ProblemTable({ initialProblems, userProgress, filters }: ProblemTableProps) {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [hasMore, setHasMore] = useState(initialProblems.length === 50);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    const lastProblem = problems[problems.length - 1];
    const nextBatch = await fetchMoreProblems(
      filters.difficulty,
      filters.topic,
      filters.search,
      lastProblem?.id
    );

    if (nextBatch.length < 50) {
      setHasMore(false);
    }

    // Cast as Problem[] because service returns Prisma objects that match the interface
    setProblems((prev) => [...prev, ...nextBatch as Problem[]]);
    setIsLoading(false);
  }, [problems, hasMore, isLoading, filters]);

  // Reset list when initialProblems changes (e.g. filters changed on server)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProblems(initialProblems);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMore(initialProblems.length === 50);
  }, [initialProblems]);

  useEffect(() => {
    if (inView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
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
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                No problems found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {problems.map((problem) => {
                const status = userProgress[problem.id];
                return (
                  <TableRow key={problem.id} className="group transition-colors">
                    <TableCell>
                      {status === "Solved" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : status === "Attempted" ? (
                        <PlayCircle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground group-hover:text-foreground/50 transition-colors" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/problems/${problem.slug}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("px-2 py-0 h-6 text-[10px] font-bold uppercase tracking-wider", getDifficultyColor(problem.difficulty))}>
                        {problem.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {problem.topics.slice(0, 3).map((t: any) => (
                          <Badge key={t.id} variant="outline" className="bg-muted/50 text-[10px] h-5 border-white/5">
                            {t.name}
                          </Badge>
                        ))}
                        {problem.topics.length > 3 && (
                          <Badge variant="outline" className="text-[10px] h-5 opacity-50">
                            +{problem.topics.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {problem.videoUrl ? (
                        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500">
                          <a
                            href={problem.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <PlayCircle className="h-5 w-5" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground/30 text-xs px-2">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {hasMore && (
                <TableRow ref={ref} className="hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more problems...
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
