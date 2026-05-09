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
import { ChevronLeft, PlayCircle, Bookmark, CheckCircle2, Clock, Cpu, ExternalLink } from "lucide-react";
import { CodeEditor } from "@/components/problems/code-editor";
import { ProblemActions } from "@/components/problems/problem-actions";
import { ProblemNotes } from "@/components/problems/problem-notes";
import { getProblemBySlug } from "@/server/services/problem.service";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const problem = await getProblemBySlug(slug);

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
  
  const relatedProblems = [...(problem.relatedTo || []), ...(problem.relatedFrom || [])];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-card shadow-sm">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
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
                {problem.companies.map((company) => (
                  <Badge key={company} variant="secondary" className="text-[10px] h-5 bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {company}
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
              <TabsTrigger value="complexity">Complexity</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 focus-visible:outline-none">
              <Card>
                <CardContent className="pt-6 prose prose-sm dark:prose-invert max-w-none">
                  <div 
                    className="space-y-4"
                    dangerouslySetInnerHTML={{ __html: problem.description }} 
                  />
                  
                  <div className="mt-8 space-y-6">
                    {examples.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Examples:</h3>
                        {examples.map((ex: any, i: number) => (
                          <div key={i} className="bg-muted p-4 rounded-lg font-mono text-sm border">
                            <p><span className="text-muted-foreground">Input: </span>{ex.input}</p>
                            <p><span className="text-muted-foreground">Output: </span>{ex.output}</p>
                            {ex.explanation && <p className="mt-2 text-xs"><span className="text-muted-foreground">Explanation: </span>{ex.explanation}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {constraints.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Constraints:</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {constraints.map((c: string, i: number) => (
                            <li key={i} className="font-mono text-xs text-muted-foreground">{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="complexity" className="mt-4 focus-visible:outline-none">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Algorithm Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Time Complexity</p>
                      <p className="font-mono">{problem.timeComplexity || "O(N)"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border">
                    <Cpu className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Space Complexity</p>
                      <p className="font-mono">{problem.spaceComplexity || "O(1)"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="related" className="mt-4 focus-visible:outline-none">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Similar Problems</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relatedProblems.length > 0 ? (
                      relatedProblems.map((rp: any) => (
                        <Link 
                          key={rp.id} 
                          href={`/problems/${rp.slug}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium group-hover:text-primary">{rp.title}</span>
                            <Badge variant="outline" className="text-[10px]">{rp.difficulty}</Badge>
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic text-center py-4">No related problems found.</p>
                    )}
                  </div>
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

          <ProblemNotes 
            problemId={problem.id}
            initialContent={userNote?.content || ""}
          />

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