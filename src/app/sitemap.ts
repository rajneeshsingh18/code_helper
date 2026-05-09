import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Static routes
  const routes = ["", "/problems", "/sheets", "/auth/signin", "/auth/register"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    })
  );

  // Dynamic Problems (fetch only slugs and updatedAt)
  const problems = await db.problem.findMany({
    select: { slug: true, updatedAt: true },
  });

  const problemRoutes = problems.map((problem) => ({
    url: `${baseUrl}/problems/${problem.slug}`,
    lastModified: problem.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic Sheets
  const sheets = await db.topicSheet.findMany({
    select: { slug: true, updatedAt: true },
  });

  const sheetRoutes = sheets.map((sheet) => ({
    url: `${baseUrl}/sheets/${sheet.slug}`,
    lastModified: sheet.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...problemRoutes, ...sheetRoutes];
}
