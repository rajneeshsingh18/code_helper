import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Search, Filter, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { cn, getDifficultyColor } from "@/lib/utils";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; topic?: string; search?: string }>;
}) {
  const params = await searchParams;

  const difficulty = params.difficulty || "all";
  const topic = params.topic || "all";
  const search = params.search || "";

  const whereClause: any = {};

  if (difficulty && difficulty !== "all") {
    whereClause.difficulty = difficulty;
  }

  if (search) {
    whereClause.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  const problems = await db.problem.findMany({
    where: whereClause,
    include: {
      topics: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const topics = await db.topic.findMany({
    orderBy: { name: "asc" },
  });

  const userProgress: Record<string, string> = {};

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Problems</h1>
          <p className="text-muted-foreground">
            Practice coding problems organized by difficulty and topics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="pl-10"
              defaultValue={search}
            />
          </div>
          <Select defaultValue={difficulty}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={topic}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t.id} value={t.slug}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Topics</TableHead>
                <TableHead className="w-[100px]">Video</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No problems found
                  </TableCell>
                </TableRow>
              ) : (
                problems.map((problem) => {
                  const status = userProgress[problem.id];
                  return (
                    <TableRow key={problem.id}>
                      <TableCell>
                        {status === "Solved" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : status === "Attempted" ? (
                          <PlayCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/problems/${problem.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {problem.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getDifficultyColor(problem.difficulty))}>
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {problem.topics.slice(0, 2).map((t) => (
                            <Badge key={t.id} variant="outline" className="text-xs">
                              {t.name}
                            </Badge>
                          ))}
                          {problem.topics.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{problem.topics.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {problem.videoUrl ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={problem.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}