import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, BookOpen, Target } from "lucide-react";
import { cn, getDifficultyColor } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const allProblems = await db.problem.count();
  const allTopics = await db.topic.count();
  const allSheets = await db.topicSheet.count();

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your coding practice dashboard!
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Problems solved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Easy Problems</span>
                  <span className="text-muted-foreground">0 solved</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Medium Problems</span>
                  <span className="text-muted-foreground">0 solved</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Hard Problems</span>
                  <span className="text-muted-foreground">0 solved</span>
                </div>
                <Progress value={0} className="h-2" />
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
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-medium">Browse Problems</span>
                <Badge variant="outline">View All</Badge>
              </Link>
              <Link
                href="/sheets"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-medium">Topic Sheets</span>
                <Badge variant="outline">View All</Badge>
              </Link>
              <Link
                href="/admin"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-medium">Admin Panel</span>
                <Badge variant="outline">Import Data</Badge>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}