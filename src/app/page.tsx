import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, BookOpen, Trophy, Target, Zap, ChevronRight, TerminalSquare, Cpu, Layers } from "lucide-react";

const featuredSheets = [
  {
    name: "Blind 75",
    description: "The definitive list of high-frequency interview questions.",
    problemCount: 75,
    slug: "blind-75",
  },
  {
    name: "Top 150 Core",
    description: "Curated algorithms to master problem-solving.",
    problemCount: 150,
    slug: "top-150",
  },
  {
    name: "Graph Theory",
    description: "Deep dive into traversal, shortest path, and MST.",
    problemCount: 45,
    slug: "graph-problems",
  },
  {
    name: "Dynamic Programming",
    description: "Memoization, tabulation, and state transitions.",
    problemCount: 60,
    slug: "dp-problems",
  },
];

const features = [
  {
    icon: Layers,
    title: "Structured Roadmaps",
    description: "Curated paths that guide you from fundamental concepts to advanced dynamic programming.",
  },
  {
    icon: Target,
    title: "Precision Analytics",
    description: "Granular telemetry on your progress. Track difficulty distributions and consistency streaks.",
  },
  {
    icon: Cpu,
    title: "Pro Workspace",
    description: "A distraction-free IDE environment built for deep focus and algorithmic mastery.",
  },
  {
    icon: TerminalSquare,
    title: "Pattern Recognition",
    description: "Learn to identify underlying patterns rather than memorizing individual solutions.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden z-10">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">
            <Badge className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary border-primary/20 rounded-full">
              The Next Generation of Interview Prep
            </Badge>
            
            <h1 className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary/80">
                Algorithmic Intuition
              </span>
            </h1>
            
            <p className="mx-auto max-w-[650px] text-muted-foreground md:text-xl font-medium leading-relaxed">
              Stop grinding blindly. Build a systematic approach to technical interviews with curated roadmaps, high-performance tooling, and precision analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-4 w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 px-8 text-base font-bold shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] transition-all hover:scale-105">
                <Link href="/auth/register">
                  Deploy Workspace <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base border-white/10 hover:bg-white/5 transition-all">
                <Link href="/problems">Explore Archive</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-xs font-bold tracking-widest text-muted-foreground uppercase pt-12 border-t border-white/5 w-full mt-12">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span>3.6k+ Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>50+ Topics</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span>Live Telemetry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID FEATURES */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Engineered for Mastery</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Every feature is designed to reduce friction and maximize your learning velocity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/40 backdrop-blur-sm border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CURATED ROADMAPS */}
      <section className="py-24 bg-black/20 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Curated Roadmaps</h2>
              <p className="text-muted-foreground text-lg">
                Don&apos;t know where to start? Follow industry-standard lists designed to cover all major patterns.
              </p>
            </div>
            <Button asChild variant="ghost" className="shrink-0 hover:bg-white/5">
              <Link href="/sheets">
                View All Sheets <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredSheets.map((sheet) => (
              <Link key={sheet.slug} href={`/sheets/${sheet.slug}`} className="block group">
                <Card className="h-full bg-card/60 backdrop-blur-md border-white/10 group-hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <Badge variant="secondary" className="bg-white/5 font-mono text-[10px]">
                        {sheet.problemCount} Qs
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{sheet.name}</CardTitle>
                    <CardDescription className="pt-2 text-sm leading-relaxed">{sheet.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                      Start Training <ChevronRight className="h-4 w-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/20 blur-[100px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 relative z-10">
              Initialize Your Command Center
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of engineers optimizing their interview performance. Secure your access to the ultimate coding platform.
            </p>
            <Button asChild size="lg" className="h-14 px-10 text-base font-bold relative z-10 shadow-2xl">
              <Link href="/auth/register">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 bg-black/40 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-black text-xl tracking-tight">CodePrep</span>
            </div>
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/problems" className="hover:text-primary transition-colors">Archive</Link>
              <Link href="/sheets" className="hover:text-primary transition-colors">Roadmaps</Link>
              <Link href="/auth/signin" className="hover:text-primary transition-colors">Sign In</Link>
            </div>
            <p className="text-xs text-muted-foreground opacity-60">
              © {new Date().getFullYear()} CodePrep. Elevated telemetry.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
