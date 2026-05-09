import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, BookOpen, Trophy, Target, Zap, ChevronRight } from "lucide-react";

const featuredSheets = [
  {
    name: "Blind 75",
    description: "Most frequently asked questions in tech interviews",
    problemCount: 75,
    slug: "blind-75",
  },
  {
    name: "Top 150 LeetCode",
    description: "Curated list of top LeetCode problems",
    problemCount: 150,
    slug: "top-150",
  },
  {
    name: "Graph Problems",
    description: "Master BFS, DFS, and graph algorithms",
    problemCount: 45,
    slug: "graph-problems",
  },
  {
    name: "Dynamic Programming",
    description: "Complete DP from beginner to advanced",
    problemCount: 60,
    slug: "dp-problems",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Organized by Topics",
    description: "Problems organized by topics and difficulty for structured learning",
  },
  {
    icon: Target,
    title: "Progress Tracking",
    description: "Track your progress with detailed analytics and streaks",
  },
  {
    icon: Trophy,
    title: "Company Tags",
    description: "Filter by companies like Google, Meta, Amazon and more",
  },
  {
    icon: Zap,
    title: "Video Solutions",
    description: "Learn from expert video solutions for each problem",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Master Your{" "}
                <span className="text-primary">Coding Interviews</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Practice coding problems organized by topics and difficulty. Track your progress
                and ace your next interview.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/problems">
                  Start Practicing <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sheets">View Topic Sheets</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground mt-8">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                <span>500+ Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>50+ Topics</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>10K+ Users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4 mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Featured Topic Sheets</h2>
            <p className="text-muted-foreground">
              Curated problem lists for structured interview preparation
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredSheets.map((sheet) => (
              <Link key={sheet.slug} href={`/sheets/${sheet.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {sheet.name}
                      <Badge variant="secondary">{sheet.problemCount} problems</Badge>
                    </CardTitle>
                    <CardDescription>{sheet.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary text-sm">
                      View problems <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild variant="ghost">
              <Link href="/sheets">
                View all sheets <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4 mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Why CodePrep?</h2>
            <p className="text-muted-foreground">
              Everything you need to ace your technical interviews
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-3 p-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to start your journey?
            </h2>
            <p className="text-muted-foreground max-w-[500px]">
              Join thousands of developers who are preparing for their dream jobs
            </p>
            <Button asChild size="lg">
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              <span className="font-semibold">CodePrep</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CodePrep. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}