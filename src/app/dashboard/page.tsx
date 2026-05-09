import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, BookOpen, Target, Trophy, Flame, Code2, Sparkles, Layers } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardStats, getUserProgressStats } from "@/server/services/dashboard.service";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  // Global app stats (Cached via service layer)
  const { allProblems, allTopics, allSheets, counts } = await getDashboardStats();
  
  // User-specific stats
  const { totalSolved, easySolved, mediumSolved, hardSolved } = await getUserProgressStats(userId);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none opacity-50" />
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vh] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto relative z-10 py-12 lg:py-20 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-l-4 border-primary pl-6">
          <Badge className="w-fit text-[10px] tracking-widest uppercase bg-primary/20 text-primary border-none">Command Center</Badge>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tighter text-foreground">
            Welcome back,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              {session.user.name || "Developer"}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed">
            Your telemetry is looking good. Track your algorithmic growth, review your recent challenges, and prepare for your next technical interview.
          </p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Solved</CardTitle>
              <Trophy className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tabular-nums">{totalSolved}</div>
              <p className="text-xs text-primary/80 mt-1 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Top 10% of users
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Problems</CardTitle>
              <Code2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tabular-nums text-foreground/80">{allProblems}</div>
              <p className="text-xs text-muted-foreground mt-1">Available in database</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Topics</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tabular-nums text-foreground/80">{allTopics}</div>
              <p className="text-xs text-muted-foreground mt-1">Algorithm categories</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Topic Sheets</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tabular-nums text-foreground/80">{allSheets}</div>
              <p className="text-xs text-muted-foreground mt-1">Curated roadmaps</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-gradient-to-br from-card/80 to-card/30 backdrop-blur-md border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Difficulty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold tracking-wide text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400" /> EASY
                  </span>
                  <span className="font-mono text-muted-foreground">{easySolved} <span className="opacity-50">/ {counts.easy}</span></span>
                </div>
                <Progress value={counts.easy > 0 ? (easySolved / counts.easy) * 100 : 0} className="h-3 bg-green-400/10 [&>div]:bg-green-400 rounded-sm" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold tracking-wide text-yellow-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" /> MEDIUM
                  </span>
                  <span className="font-mono text-muted-foreground">{mediumSolved} <span className="opacity-50">/ {counts.medium}</span></span>
                </div>
                <Progress value={counts.medium > 0 ? (mediumSolved / counts.medium) * 100 : 0} className="h-3 bg-yellow-400/10 [&>div]:bg-yellow-400 rounded-sm" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold tracking-wide text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> HARD
                  </span>
                  <span className="font-mono text-muted-foreground">{hardSolved} <span className="opacity-50">/ {counts.hard}</span></span>
                </div>
                <Progress value={counts.hard > 0 ? (hardSolved / counts.hard) * 100 : 0} className="h-3 bg-red-400/10 [&>div]:bg-red-400 rounded-sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-white/10 flex flex-col">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center space-y-4">
              <Link
                href="/problems"
                className="group relative flex flex-col p-4 rounded-xl bg-muted/30 hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300"
              >
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">Browse Problems</span>
                <span className="text-xs text-muted-foreground mt-1">Filter by topics and difficulty</span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  →
                </div>
              </Link>
              
              <Link
                href="/sheets"
                className="group relative flex flex-col p-4 rounded-xl bg-muted/30 hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300"
              >
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">Study Sheets</span>
                <span className="text-xs text-muted-foreground mt-1">Curated lists like Blind 75</span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  →
                </div>
              </Link>
              
              <Link
                href="/problems?difficulty=Easy"
                className="group relative flex flex-col p-4 rounded-xl bg-green-500/5 hover:bg-green-500/10 border border-green-500/10 hover:border-green-500/30 transition-all duration-300"
              >
                <span className="font-bold text-green-500">Warm Up</span>
                <span className="text-xs text-muted-foreground mt-1">Practice easy problems</span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-green-500">
                  →
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}