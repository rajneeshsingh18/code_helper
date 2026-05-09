import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getDifficultyColor } from "@/lib/utils";
import { ChevronLeft, PlayCircle, Bookmark, CheckCircle2, Clock, Cpu, ExternalLink, FileText, Beaker, Network } from "lucide-react";
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": problem.title,
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": `An algorithmic practice problem titled ${problem.title} with a difficulty of ${problem.difficulty}.`,
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] bg-[#0A0A0A] flex flex-col text-foreground overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* IDE Top Bar */}
      <div className="h-12 shrink-0 border-b border-white/5 bg-[#111111] flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Link href="/problems">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-sm font-semibold tracking-tight">{problem.title}</h1>
          <Badge variant="outline" className={cn("px-1.5 py-0 h-5 text-[9px] uppercase tracking-wider border-white/10", getDifficultyColor(problem.difficulty))}>
            {problem.difficulty}
          </Badge>
          
          {problem.companies.slice(0, 2).map((company) => (
            <Badge key={company} variant="secondary" className="px-1.5 py-0 h-5 text-[9px] uppercase tracking-wider bg-white/5 text-muted-foreground hover:bg-white/10">
              {company}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {userProgress?.status === "Solved" && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" /> Solved
            </div>
          )}
          {isBookmarked && <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
          
          {problem.videoUrl && (
            <Button variant="outline" size="sm" asChild className="h-8 text-xs bg-[#1A1A1A] border-white/10 hover:bg-white/5">
              <a href={problem.videoUrl} target="_blank" rel="noopener noreferrer">
                <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                Solution
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Description & Meta */}
        <div className="w-1/2 min-w-[400px] border-r border-white/5 flex flex-col bg-[#0F0F0F]">
          <Tabs defaultValue="description" className="flex flex-col h-full">
            <div className="px-2 pt-2 border-b border-white/5 bg-[#111111]">
              <TabsList className="bg-transparent h-9 p-0 flex gap-1">
                <TabsTrigger value="description" className="data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-foreground text-muted-foreground rounded-t-md rounded-b-none border-b-0 px-4 h-full text-xs font-medium">
                  <FileText className="h-3.5 w-3.5 mr-1.5" /> Description
                </TabsTrigger>
                <TabsTrigger value="complexity" className="data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-foreground text-muted-foreground rounded-t-md rounded-b-none border-b-0 px-4 h-full text-xs font-medium">
                  <Cpu className="h-3.5 w-3.5 mr-1.5" /> Analysis
                </TabsTrigger>
                <TabsTrigger value="related" className="data-[state=active]:bg-[#1E1E1E] data-[state=active]:text-foreground text-muted-foreground rounded-t-md rounded-b-none border-b-0 px-4 h-full text-xs font-medium">
                  <Network className="h-3.5 w-3.5 mr-1.5" /> Related
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
              <TabsContent value="description" className="m-0 focus-visible:outline-none space-y-8">
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {problem.topics.map((topic) => (
                    <Badge key={topic.id} variant="outline" className="bg-white/5 border-white/5 text-[10px] text-muted-foreground hover:text-foreground">
                      {topic.name}
                    </Badge>
                  ))}
                </div>

                <div 
                  className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-[#1A1A1A] prose-pre:border prose-pre:border-white/5"
                  dangerouslySetInnerHTML={{ __html: problem.description }} 
                />
                
                {examples.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Examples</h3>
                    {examples.map((ex: any, i: number) => (
                      <div key={i} className="bg-[#161616] p-4 rounded-lg font-mono text-sm border border-white/5">
                        <p><span className="text-white/40">Input:</span> <span className="text-green-300">{ex.input}</span></p>
                        <p className="mt-1"><span className="text-white/40">Output:</span> <span className="text-blue-300">{ex.output}</span></p>
                        {ex.explanation && (
                          <p className="mt-3 pt-3 border-t border-white/5 text-xs text-muted-foreground font-sans">
                            <span className="font-semibold text-white/60">Explanation:</span> {ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {constraints.length > 0 && (
                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Constraints</h3>
                    <ul className="space-y-1.5">
                      {constraints.map((c: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary/50 mt-1">•</span>
                          <span className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded text-muted-foreground">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="complexity" className="m-0 focus-visible:outline-none">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-5 bg-[#161616] rounded-xl border border-white/5">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Time Complexity</p>
                      <p className="font-mono text-xl text-blue-300">{problem.timeComplexity || "O(N)"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-[#161616] rounded-xl border border-white/5">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <Cpu className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Space Complexity</p>
                      <p className="font-mono text-xl text-purple-300">{problem.spaceComplexity || "O(1)"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="related" className="m-0 focus-visible:outline-none">
                <div className="space-y-3">
                  {relatedProblems.length > 0 ? (
                    relatedProblems.map((rp: any) => (
                      <Link 
                        key={rp.id} 
                        href={`/problems/${rp.slug}`}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#161616] hover:bg-[#1E1E1E] border border-white/5 hover:border-white/10 transition-all group"
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{rp.title}</span>
                          <Badge variant="outline" className={cn("w-fit text-[9px] uppercase tracking-wider bg-transparent", getDifficultyColor(rp.difficulty))}>
                            {rp.difficulty}
                          </Badge>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                      <Network className="h-8 w-8 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground italic">No related problems mapped yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Panel: Editor & Controls */}
        <div className="flex-1 flex flex-col bg-[#050505]">
          <div className="flex-1 p-2">
            <div className="h-full rounded-xl overflow-hidden border border-white/5 shadow-2xl">
              <CodeEditor 
                problemId={problem.id}
                initialCode={userProgress?.code || problem.starterCode || ""}
              />
            </div>
          </div>

          <div className="h-64 shrink-0 border-t border-white/5 bg-[#0F0F0F] flex flex-col">
            <Tabs defaultValue="notes" className="flex flex-col h-full">
              <div className="px-2 pt-2 border-b border-white/5 bg-[#111111]">
                <TabsList className="bg-transparent h-8 p-0 flex gap-1">
                  <TabsTrigger value="notes" className="data-[state=active]:bg-[#1E1E1E] text-muted-foreground rounded-t-md rounded-b-none border-b-0 px-4 h-full text-xs font-medium">
                    Personal Notes
                  </TabsTrigger>
                  <TabsTrigger value="testcases" className="data-[state=active]:bg-[#1E1E1E] text-muted-foreground rounded-t-md rounded-b-none border-b-0 px-4 h-full text-xs font-medium">
                    <Beaker className="h-3 w-3 mr-1.5" /> Test Cases
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                <TabsContent value="notes" className="m-0 h-full">
                  <ProblemNotes 
                    problemId={problem.id}
                    initialContent={userNote?.content || ""}
                  />
                </TabsContent>
                <TabsContent value="testcases" className="m-0">
                  <div className="space-y-3">
                    {testCases.length > 0 ? (
                      testCases.map((tc: any, i: number) => (
                        <div key={i} className="flex gap-4 p-3 bg-[#161616] rounded-lg font-mono text-xs border border-white/5">
                          <div className="w-8 h-8 shrink-0 rounded bg-white/5 flex items-center justify-center text-muted-foreground">
                            {i+1}
                          </div>
                          <div className="space-y-1 overflow-x-auto">
                            <p className="flex gap-2"><span className="text-white/30 w-12 shrink-0">Input:</span> <span className="text-green-300">{JSON.stringify(tc.input)}</span></p>
                            <p className="flex gap-2"><span className="text-white/30 w-12 shrink-0">Output:</span> <span className="text-blue-300">{JSON.stringify(tc.expected)}</span></p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No test cases available</p>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Action Bar */}
          <div className="h-14 shrink-0 border-t border-white/5 bg-[#0A0A0A] flex items-center justify-between px-4">
            <ProblemActions 
              problemId={problem.id}
              isBookmarked={isBookmarked}
              status={userProgress?.status || null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
