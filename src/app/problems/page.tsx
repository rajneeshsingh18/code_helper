import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ProblemFilters } from "./problem-filters";
import { getProblems, getTopics } from "@/server/services/problem.service";
import { ProblemTable } from "./problem-table";
import { Code2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; topic?: string; search?: string }>;
}) {
  const params = await searchParams;

  const difficulty = params.difficulty;
  const topicSlug = params.topic;
  const search = params.search || "";

  // Fetch initial batch of 50 problems
  const initialProblems = await getProblems(difficulty, topicSlug, search, 50);
  const topics = await getTopics();

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
    <div className="min-h-screen bg-background relative">
      {/* Ambient background decorative elements */}
      <div className="absolute top-0 right-0 w-[30vw] h-[30vh] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto relative z-10 py-12 lg:py-16 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-primary/30 text-primary">Library</Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
              Problem <span className="text-muted-foreground">Archive</span>
            </h1>
            <p className="text-muted-foreground max-w-[500px]">
              Master algorithmic patterns through curated challenges. Filter by topic or difficulty to start your session.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card/30 backdrop-blur-sm p-2 rounded-xl border border-white/5 shadow-2xl">
            <div className="px-4 py-2 text-center border-r border-white/5">
              <div className="text-2xl font-black">{initialProblems.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Loaded</div>
            </div>
            <div className="px-4 py-2 text-center">
              <div className="text-2xl font-black text-primary flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                3.6k+
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl">
            <ProblemFilters topics={topics} />
          </div>

          <ProblemTable 
            initialProblems={initialProblems} 
            userProgress={userProgress} 
            filters={{ difficulty, topic: topicSlug, search }}
          />
        </div>
      </div>
    </div>
  );
}