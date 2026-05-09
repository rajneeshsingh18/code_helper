import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getDifficultyColor } from "@/lib/utils";
import { ChevronLeft, PlayCircle, Bookmark, CheckCircle2 } from "lucide-react";
import { CodeEditor } from "@/components/problems/code-editor";
import { ProblemActions } from "@/components/problems/problem-actions";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const problem = await db.problem.findUnique({
    where: { slug },
    include: {
      topics: true,
    },
  });

  if (!problem) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  
  let userProgress = null;
  let userNote = null;
  let isBookmarked = false;

  if (session?.user?.id) {
    [userProgress, userNote, isBookmarked] = await Promise.all([
      db.userProgress.findUnique({
        where: { userId_problemId: { userId: session.user.id, problemId: problem.id } },
      }),
      db.userNote.findUnique({
        where: { userId_problemId: { userId: session.user.id, problemId: problem.id } },
      }),
      db.bookmark.findUnique({
        where: { userId_problemId: { userId: session.user.id, problemId: problem.id } },
      }).then(b => !!b),
    ]);
  }

  const examples = problem.examples ? JSON.parse(problem.examples) : [];
  const constraints = problem.constraints ? JSON.parse(problem.constraints) : [];
  const testCases = problem.testCases ? JSON.parse(problem.testCases) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/problems">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">{problem.title}</h1>
                <Badge className={cn(getDifficultyColor(problem.difficulty))}>
                  {problem.difficulty}
                </Badge>
                {isBookmarked && <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {problem.topics.map((topic) => (
                  <Badge key={topic.id} variant="outline" className="text-[10px] h-5">
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {userProgress?.status === "Solved" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
              {problem.videoUrl && (
                <Button variant="outline" size="sm" asChild className="h-9">
                  <a href={problem.videoUrl} target="_blank" rel="noopener noreferrer">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Video Solution
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container py-6 grid lg:grid-cols-2 gap-6 overflow-hidden">
        <div className="flex flex-col gap-6 overflow-auto pr-2">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 focus-visible:outline-none">
              <Card>
                <CardContent className="pt-6 prose prose-sm dark:prose-invert max-w-none">
                  <div 
                    className="space-y-4"
                    dangerouslySetInnerHTML={{ __html: problem.description }} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="examples" className="mt-4 focus-visible:outline-none">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  {examples.length > 0 ? (
                    examples.map((ex: any, i: number) => (
                      <div key={i} className="space-y-2">
                        <p className="font-semibold text-sm">Example {i + 1}:</p>
                        <div className="bg-muted p-4 rounded-lg font-mono text-sm border">
                          <p>
                            <span className="text-muted-foreground">Input: </span>
                            {ex.input}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Output: </span>
                            {ex.output}
                          </p>
                          {ex.explanation && (
                            <p className="mt-2 pt-2 border-t border-muted-foreground/10">
                              <span className="text-muted-foreground">Explanation: </span>
                              {ex.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No examples available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="constraints" className="mt-4 focus-visible:outline-none">
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc list-inside space-y-2">
                    {constraints.length > 0 ? (
                      constraints.map((c: string, i: number) => (
                        <li key={i} className="font-mono text-sm text-muted-foreground">
                          {c}
                        </li>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No constraints specified</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="testcases" className="mt-4 focus-visible:outline-none">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {testCases.length > 0 ? (
                    testCases.map((tc: any, i: number) => (
                      <div key={i} className="bg-muted p-4 rounded-lg font-mono text-sm border">
                        <p className="font-semibold text-xs text-muted-foreground mb-2">Case {i + 1}</p>
                        <p>
                          <span className="text-muted-foreground">Input: </span>
                          <span className="text-primary">{JSON.stringify(tc.input)}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Output: </span>
                          <span className="text-green-500">{JSON.stringify(tc.expected)}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No test cases available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {userNote && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Your Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{userNote.content}</p>
              </CardContent>
            </Card>
          )}

          {problem.solution && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Solution Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto border">
                  {problem.solution}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 min-h-[500px]">
            <CodeEditor 
              problemId={problem.id}
              initialCode={userProgress?.code || problem.starterCode || ""}
            />
          </div>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ProblemActions 
                problemId={problem.id}
                isBookmarked={isBookmarked}
                status={userProgress?.status || null}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}