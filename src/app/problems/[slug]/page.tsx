import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getDifficultyColor } from "@/lib/utils";
import { ChevronLeft, PlayCircle, Bookmark, CheckCircle2, Clock } from "lucide-react";

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

  const userProgress: any = null;
  const userNote: any = null;
  const isBookmarked = false;

  const examples = problem.examples ? JSON.parse(problem.examples) : [];
  const constraints = problem.constraints ? JSON.parse(problem.constraints) : [];
  const testCases = problem.testCases ? JSON.parse(problem.testCases) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
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
                  <Badge key={topic.id} variant="outline">
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {userProgress?.status === "Solved" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
              {problem.videoUrl && (
                <Button variant="outline" size="sm" asChild>
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

      <div className="container py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
                <TabsTrigger value="testcases">Test Cases</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-6 prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="examples" className="mt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {examples.length > 0 ? (
                      examples.map((ex: any, i: number) => (
                        <div key={i} className="space-y-2">
                          <p className="font-medium">Example {i + 1}:</p>
                          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                            <p>
                              <span className="text-muted-foreground">Input: </span>
                              {ex.input}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Output: </span>
                              {ex.output}
                            </p>
                            {ex.explanation && (
                              <p className="mt-2">
                                <span className="text-muted-foreground">Explanation: </span>
                                {ex.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No examples available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="constraints" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="list-disc list-inside space-y-2">
                      {constraints.map((c: string, i: number) => (
                        <li key={i} className="font-mono text-sm">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="testcases" className="mt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {testCases.length > 0 ? (
                      testCases.map((tc: any, i: number) => (
                        <div key={i} className="bg-muted p-4 rounded-lg font-mono text-sm">
                          <p>
                            <span className="text-muted-foreground">Case {i + 1}:</span>
                          </p>
                          <p className="mt-1">
                            <span className="text-muted-foreground">Input: </span>
                            {JSON.stringify(tc.input)}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Output: </span>
                            {JSON.stringify(tc.expected)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No test cases available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {userNote && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Your Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{userNote.content}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Code Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm min-h-[300px] whitespace-pre-wrap">
                  {userProgress?.code || problem.starterCode || "// Write your code here"}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">Run Code</Button>
                  <Button variant="outline" className="flex-1">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {userProgress?.status === "Solved" ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Already Solved
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    Mark as Solved
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Bookmark className="h-4 w-4 mr-2" />
                  {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                </Button>
              </CardContent>
            </Card>

            {problem.solution && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {problem.solution}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}