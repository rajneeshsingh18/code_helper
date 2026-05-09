import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Layers, BookOpen } from "lucide-react";

export default async function SheetsPage() {
  const sheets = await db.topicSheet.findMany({
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto relative z-10 py-12 lg:py-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-primary/30 text-primary">Curriculums</Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
              Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Roadmaps</span>
            </h1>
            <p className="text-muted-foreground max-w-[500px] text-lg">
              Structured learning paths. Don&apos;t know what to practice? Pick a roadmap and follow the optimal progression.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet) => (
            <Link key={sheet.id} href={`/sheets/${sheet.slug}`} className="block group">
              <Card className="h-full bg-card/60 backdrop-blur-md border-white/10 group-hover:border-primary/50 transition-all duration-300 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="h-16 w-16" />
                </div>
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                      <Layers className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <Badge variant="secondary" className="bg-white/5 font-mono text-[10px]">
                      {sheet.problems.length} Qs
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{sheet.name}</CardTitle>
                  {sheet.description && (
                    <CardDescription className="pt-2 text-sm leading-relaxed">{sheet.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="mt-auto pt-4 border-t border-white/5 relative z-10">
                  <div className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                    Start Roadmap <ChevronRight className="h-4 w-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {sheets.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold">No roadmaps available</h3>
            <p className="text-muted-foreground text-sm">Please check back later or contact the administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
}
