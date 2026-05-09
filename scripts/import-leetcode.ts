import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

interface SheetRow {
  __EMPTY?: string;
  __EMPTY_5?: string;
  __EMPTY_6?: string;
  __EMPTY_7?: string;
  __EMPTY_8?: string;
}

async function importLeetcode() {
  console.log("Starting import...");

  const workbook = XLSX.readFile("src/components/sheets/leetcode.xlsx", { raw: true, defval: "" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<SheetRow>(sheet, { defval: "" });

  const headerRow = data.find((r) => r.__EMPTY === "Problem Name");
  const dataRows = data.slice(data.indexOf(headerRow) + 1).filter((r) => r.__EMPTY);

  console.log(`Found ${dataRows.length} problems to import`);

  const allTopics = new Set<string>();
  const allPatterns = new Set<string>();

  dataRows.forEach((row) => {
    const topics = row.__EMPTY_5?.toString() || "";
    if (topics) topics.split(",").forEach((t) => allTopics.add(t.trim()));
    
    const pattern = row.__EMPTY_6?.toString() || "";
    if (pattern) allPatterns.add(pattern.trim());
  });

  console.log(`Found ${allTopics.size} unique topics, ${allPatterns.size} patterns`);

  for (const topicName of allTopics) {
    await prisma.topic.upsert({
      where: { slug: slugify(topicName) },
      update: {},
      create: { name: topicName, slug: slugify(topicName) },
    });
  }

  for (const patternName of allPatterns) {
    if (patternName && patternName !== "Mixed") {
      await prisma.topic.upsert({
        where: { slug: slugify(patternName) },
        update: {},
        create: { name: patternName, slug: slugify(patternName) },
      });
    }
  }

  console.log("Topics created!");

  let imported = 0;
  let skipped = 0;

  for (const row of dataRows.slice(0, 100)) {
    const title = row.__EMPTY?.toString().trim();
    const topicsStr = row.__EMPTY_5?.toString() || "";
    const patternStr = row.__EMPTY_6?.toString() || "";
    const suggestedDifficulty = parseDifficulty(row.__EMPTY_8?.toString() || "Medium");

    if (!title) {
      skipped++;
      continue;
    }

    const slug = slugify(title);

    try {
      const topicNames = topicsStr.split(",").map((t) => t.trim()).filter(Boolean);
      if (patternStr && patternStr !== "Mixed") {
        topicNames.push(patternStr);
      }

      const dbTopics = await prisma.topic.findMany({
        where: { name: { in: topicNames } },
      });

      await prisma.problem.upsert({
        where: { slug },
        update: {
          difficulty: suggestedDifficulty,
          topics: { set: dbTopics.map((t) => ({ id: t.id })) },
        },
        create: {
          title,
          slug,
          difficulty: suggestedDifficulty,
          description: `Problem ${title}`,
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
    } catch {
      skipped++;
    }
  }

  console.log(`\nImport complete!`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
}

importLeetcode()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });