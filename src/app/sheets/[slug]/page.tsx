import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, Circle, PlayCircle, Trophy, BookOpen } from "lucide-react";
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

  const session = await getServerSession(authOptions);
  const userProgress: Record<string, string> = {};
  let solvedCount = 0;

  if (session?.user?.id) {
    const progress = await db.userProgress.findMany({
      where: { 
        userId: session.user.id,
        problemId: { in: sheet.problems.map(p => p.problem.id) }
      },
      select: { problemId: true, status: true },
    });
    progress.forEach((p) => {
      userProgress[p.problemId] = p.status;
      if (p.status === "Solved") solvedCount++;
    });
  }

  const progressPercent = sheet.problems.length > 0 
    ? Math.round((solvedCount / sheet.problems.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto relative z-10 py-12 lg:py-16 space-y-12 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col gap-8">
          <Button variant="ghost" size="sm" asChild className="w-fit text-muted-foreground hover:text-foreground pl-0 group">
            <Link href="/sheets">
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Roadmaps
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-primary/30 text-primary bg-primary/5">
                  Curriculum
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
                {sheet.name}
              </h1>
              {sheet.description && (
                <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed">
                  {sheet.description}
                </p>
              )}
            </div>

            {/* Progress Box */}
            <div className="shrink-0 bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-2xl min-w-[250px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-muted-foreground">
                  <Trophy className="h-4 w-4 text-primary" />
                  Progress
                </div>
                <span className="text-2xl font-black tabular-nums">{progressPercent}%</span>
              </div>
              <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden shadow-inner border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground font-mono text-right">
                {solvedCount} / {sheet.problems.length} COMPLETED
              </div>
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className="space-y-3">
          {sheet.problems.map((sp, index) => {
            const status = userProgress[sp.problem.id];
            const isSolved = status === "Solved";
            const isAttempted = status === "Attempted";
            
            return (
              <Link key={sp.id} href={`/problems/${sp.problem.slug}`} className="block group">
                <Card
                  className={cn(
                    "transition-all duration-300 bg-card/30 backdrop-blur-sm border-white/5 hover:bg-card/60 group-hover:border-white/20",
                    isSolved && "bg-green-500/5 border-green-500/20 hover:border-green-500/40"
                  )}
                >
                  <CardContent className="p-4 sm:p-5 flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/40 border border-white/5 font-mono text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                      {index + 1}
                    </div>
                    
                    <div className="shrink-0 transition-transform group-hover:scale-110">
                      {isSolved ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                      ) : isAttempted ? (
                        <PlayCircle className="h-6 w-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                      <div className="space-y-1.5 truncate">
                        <h3 className={cn(
                          "font-bold text-base truncate transition-colors group-hover:text-primary",
                          isSolved && "text-muted-foreground line-through decoration-green-500/30"
                        )}>
                          {sp.problem.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {sp.problem.topics.slice(0, 3).map(t => (
                            <Badge key={t.id} variant="secondary" className="bg-white/5 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold px-1.5 py-0">
                              {t.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <Badge className={cn("px-2 py-0.5 h-6 text-[10px] font-bold uppercase tracking-wider", getDifficultyColor(sp.problem.difficulty))}>
                          {sp.problem.difficulty}
                        </Badge>
                        {sp.problem.videoUrl && (
                          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-muted-foreground group-hover:text-red-400 group-hover:bg-red-400/10 transition-all">
                            <PlayCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {sheet.problems.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold">No problems mapped yet</h3>
              <p className="text-muted-foreground text-sm">This roadmap is currently under construction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
