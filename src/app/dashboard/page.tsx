import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, BookOpen, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  const [
    allProblems,
    allTopics,
    allSheets,
    userProgress,
    easyCount,
    mediumCount,
    hardCount,
  ] = await Promise.all([
    db.problem.count(),
    db.topic.count(),
    db.topicSheet.count(),
    db.userProgress.count({ where: { userId, status: "Solved" } }),
    db.problem.count({ where: { difficulty: "Easy" } }),
    db.problem.count({ where: { difficulty: "Medium" } }),
    db.problem.count({ where: { difficulty: "Hard" } }),
  ]);

  const solvedStats = await db.userProgress.findMany({
    where: { userId, status: "Solved" },
    include: { problem: true },
  });

  const easySolved = solvedStats.filter(s => s.problem.difficulty === "Easy").length;
  const mediumSolved = solvedStats.filter(s => s.problem.difficulty === "Medium").length;
  const hardSolved = solvedStats.filter(s => s.problem.difficulty === "Hard").length;

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name}! Track your progress and ace your interviews.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allProblems}</div>
              <p className="text-xs text-muted-foreground">Problems in database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Topics</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTopics}</div>
              <p className="text-xs text-muted-foreground">Topics available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Topic Sheets</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allSheets}</div>
              <p className="text-xs text-muted-foreground">Sheets available</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress}</div>
              <p className="text-xs text-muted-foreground">Problems solved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Problem Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-green-500">Easy</span>
                  <span className="text-muted-foreground">{easySolved} / {easyCount}</span>
                </div>
                <Progress value={easyCount > 0 ? (easySolved / easyCount) * 100 : 0} className="h-2 bg-green-500/10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-yellow-500">Medium</span>
                  <span className="text-muted-foreground">{mediumSolved} / {mediumCount}</span>
                </div>
                <Progress value={mediumCount > 0 ? (mediumSolved / mediumCount) * 100 : 0} className="h-2 bg-yellow-500/10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-red-500">Hard</span>
                  <span className="text-muted-foreground">{hardSolved} / {hardCount}</span>
                </div>
                <Progress value={hardCount > 0 ? (hardSolved / hardCount) * 100 : 0} className="h-2 bg-red-500/10" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/problems"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border"
              >
                <span className="font-medium">Browse Problems</span>
                <Badge variant="secondary">View All</Badge>
              </Link>
              <Link
                href="/sheets"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border"
              >
                <span className="font-medium">Topic Sheets</span>
                <Badge variant="secondary">View All</Badge>
              </Link>
              <Link
                href="/problems?difficulty=Easy"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border"
              >
                <span className="font-medium text-green-500">Practice Easy Problems</span>
                <Badge variant="secondary">Start</Badge>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}