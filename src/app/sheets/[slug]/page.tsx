import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { cn, getDifficultyColor } from "@/lib/utils";

export default async function SheetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const sheet = await db.topicSheet.findUnique({
    where: { slug },
    include: {
      problems: {
        include: {
          problem: {
            include: {
              topics: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!sheet) {
    notFound();
  }

  const userProgress: Record<string, string> = {};
  const solvedCount = 0;
  const progressPercent = 0;

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sheets">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{sheet.name}</h1>
          {sheet.description && (
            <p className="text-muted-foreground mt-1">{sheet.description}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Progress: {solvedCount} / {sheet.problems.length} problems
          </span>
          <span className="text-sm font-medium">{progressPercent}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {sheet.problems.map((sp, index) => {
          const status = userProgress[sp.problem.id];
          return (
            <Card
              key={sp.id}
              className={cn(
                "transition-all hover:shadow-md",
                status === "Solved" && "border-green-500/50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground font-mono text-sm w-8">
                    {index + 1}.
                  </span>
                  <div className="flex-shrink-0">
                    {status === "Solved" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : status === "Attempted" ? (
                      <PlayCircle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <Link
                    href={`/problems/${sp.problem.slug}`}
                    className="flex-1 hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{sp.problem.title}</span>
                      <Badge className={cn(getDifficultyColor(sp.problem.difficulty))}>
                        {sp.problem.difficulty}
                      </Badge>
                    </div>
                  </Link>
                  {sp.problem.videoUrl && (
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={sp.problem.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PlayCircle className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}