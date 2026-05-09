import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseDifficulty(diff: string): "Easy" | "Medium" | "Hard" {
  const d = diff?.toLowerCase().trim();
  if (d === "easy") return "Easy";
  if (d === "medium") return "Medium";
  if (d === "hard") return "Hard";
  return "Medium";
}

export async function POST(req: Request) {
  try {
    const XLSX = require("xlsx");
    const workbook = XLSX.readFile("src/components/sheets/leetcode.xlsx", { raw: true, defval: "" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const headerRow = data.find((r: any) => r["__EMPTY"] === "Problem Name");
    const dataRows = data.slice(data.indexOf(headerRow) + 1).filter((r: any) => r["__EMPTY"]);

    console.log(`Found ${dataRows.length} problems to import`);

    const allTopics = new Set<string>();
    const allPatterns = new Set<string>();

    dataRows.forEach((row: any) => {
      const topics = row["__EMPTY_5"]?.toString() || "";
      if (topics) topics.split(",").forEach((t: string) => allTopics.add(t.trim()));
      
      const pattern = row["__EMPTY_6"]?.toString() || "";
      if (pattern) allPatterns.add(pattern.trim());
    });

    console.log(`Found ${allTopics.size} unique topics, ${allPatterns.size} patterns`);

    for (const topicName of allTopics) {
      await db.topic.upsert({
        where: { slug: slugify(topicName) },
        update: {},
        create: { name: topicName, slug: slugify(topicName) },
      });
    }

    for (const patternName of allPatterns) {
      if (patternName && patternName !== "Mixed") {
        await db.topic.upsert({
          where: { slug: slugify(patternName) },
          update: {},
          create: { name: patternName, slug: slugify(patternName) },
        });
      }
    }

    let imported = 0;
    let skipped = 0;
    let errors: string[] = [];

    for (const row of dataRows) {
      const title = row["__EMPTY"]?.toString().trim();
      const topicsStr = row["__EMPTY_5"]?.toString() || "";
      const patternStr = row["__EMPTY_6"]?.toString() || "";
      const difficulty = parseDifficulty(row["__EMPTY_7"]?.toString() || "Medium");
      const suggestedDifficulty = parseDifficulty(row["__EMPTY_8"]?.toString() || "Medium");

      if (!title) {
        skipped++;
        continue;
      }

      const slug = slugify(title);

      try {
        const topicNames = topicsStr.split(",").map((t: string) => t.trim()).filter(Boolean);
        if (patternStr && patternStr !== "Mixed") {
          topicNames.push(patternStr);
        }

        const dbTopics = await db.topic.findMany({
          where: { name: { in: topicNames } },
        });

        await db.problem.upsert({
          where: { slug },
          update: {
            difficulty: suggestedDifficulty,
            topics: { set: dbTopics.map((t) => ({ id: t.id })) },
          },
          create: {
            title,
            slug,
            difficulty: suggestedDifficulty,
            description: `Problem ${title} - ${difficulty} difficulty`,
            examples: "[]",
            constraints: "[]",
            testCases: "[]",
            starterCode: `function solution() {\n  // Write your code here\n  \n}`,
            solution: "",
            topics: { connect: dbTopics.map((t) => ({ id: t.id })) },
            companies: [],
          },
        });

        imported++;
      } catch (err: any) {
        errors.push(`${title}: ${err.message}`);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      errors: errors.slice(0, 20),
      totalTopics: allTopics.size,
      totalPatterns: allPatterns.size,
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}