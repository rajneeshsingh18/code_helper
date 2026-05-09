import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

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
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Topic Sheets</h1>
          <p className="text-muted-foreground">
            Curated problem lists for structured interview preparation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet) => (
            <Link key={sheet.id} href={`/sheets/${sheet.slug}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {sheet.name}
                    <Badge variant="secondary">{sheet.problems.length} problems</Badge>
                  </CardTitle>
                  {sheet.description && (
                    <CardDescription>{sheet.description}</CardDescription>
                  )}
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

        {sheets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No topic sheets available yet.
          </div>
        )}
      </div>
    </div>
  );
}