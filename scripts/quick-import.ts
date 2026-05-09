import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
  __EMPTY_8?: string;
}

async function quickImport() {
  console.log("Quick import...");
  
  const workbook = XLSX.readFile("src/components/sheets/leetcode.xlsx", { raw: true, defval: "" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<SheetRow>(sheet, { defval: "" });

  const headerRow = data.find((r) => r.__EMPTY === "Problem Name");
  const dataRows = data.slice(data.indexOf(headerRow) + 1).filter((r) => r.__EMPTY);
  
  const rowsToImport = dataRows.slice(100, 300);
  
  console.log(`Importing ${rowsToImport.length} problems...`);

  let imported = 0;
  for (const row of rowsToImport) {
    const title = row.__EMPTY?.toString().trim();
    const topicsStr = row.__EMPTY_5?.toString() || "";
    const patternStr = row.__EMPTY_6?.toString() || "";
    const suggestedDifficulty = parseDifficulty(row.__EMPTY_8?.toString() || "Medium");

    if (!title) continue;

    const slug = slugify(title);

    try {
      const topicNames = [...topicsStr.split(",").map((t) => t.trim()).filter(Boolean)];
      if (patternStr && patternStr !== "Mixed") topicNames.push(patternStr);

      const dbTopics = await prisma.topic.findMany({ where: { name: { in: topicNames } }, take: 5 });

      await prisma.problem.upsert({
        where: { slug },
        update: { difficulty: suggestedDifficulty, topics: { set: dbTopics.map((t) => ({ id: t.id })) } },
        create: {
          title, slug, difficulty: suggestedDifficulty,
          description: `Problem ${title}`,
          examples: "[]", constraints: "[]", testCases: "[]",
          starterCode: `function solution() {\n  // Write your code here\n  \n}`,
          solution: "", topics: { connect: dbTopics.map((t) => ({ id: t.id })) }, companies: [],
        },
      });
      imported++;
    } catch {
      // skip duplicate
    }
  }

  console.log(`Imported ${imported} problems`);

  const allProblems = await prisma.problem.findMany({ take: 200 });
  
  const easySheet = await prisma.topicSheet.upsert({
    where: { slug: "easy-problems" },
    update: {},
    create: { name: "Easy Problems", slug: "easy-problems", description: "Easy difficulty problems" },
  });
  
  const easyProbs = allProblems.filter(p => p.difficulty === "Easy").slice(0, 30);
  for (let i = 0; i < easyProbs.length; i++) {
    await prisma.topicSheetProblem.upsert({
      where: { topicSheetId_problemId: { topicSheetId: easySheet.id, problemId: easyProbs[i].id } },
      update: {},
      create: { topicSheetId: easySheet.id, problemId: easyProbs[i].id, order: i },
    });
  }

  const mediumSheet = await prisma.topicSheet.upsert({
    where: { slug: "medium-problems" },
    update: {},
    create: { name: "Medium Problems", slug: "medium-problems", description: "Medium difficulty problems" },
  });
  
  const mediumProbs = allProblems.filter(p => p.difficulty === "Medium").slice(0, 30);
  for (let i = 0; i < mediumProbs.length; i++) {
    await prisma.topicSheetProblem.upsert({
      where: { topicSheetId_problemId: { topicSheetId: mediumSheet.id, problemId: mediumProbs[i].id } },
      update: {},
      create: { topicSheetId: mediumSheet.id, problemId: mediumProbs[i].id, order: i },
    });
  }

  const hardSheet = await prisma.topicSheet.upsert({
    where: { slug: "hard-problems" },
    update: {},
    create: { name: "Hard Problems", slug: "hard-problems", description: "Hard difficulty problems" },
  });
  
  const hardProbs = allProblems.filter(p => p.difficulty === "Hard").slice(0, 30);
  for (let i = 0; i < hardProbs.length; i++) {
    await prisma.topicSheetProblem.upsert({
      where: { topicSheetId_problemId: { topicSheetId: hardSheet.id, problemId: hardProbs[i].id } },
      update: {},
      create: { topicSheetId: hardSheet.id, problemId: hardProbs[i].id, order: i },
    });
  }

  const top100Sheet = await prisma.topicSheet.upsert({
    where: { slug: "top-100" },
    update: {},
    create: { name: "Top 100 Problems", slug: "top-100", description: "Top 100 most popular problems" },
  });
  
  for (let i = 0; i < Math.min(100, allProblems.length); i++) {
    await prisma.topicSheetProblem.upsert({
      where: { topicSheetId_problemId: { topicSheetId: top100Sheet.id, problemId: allProblems[i].id } },
      update: {},
      create: { topicSheetId: top100Sheet.id, problemId: allProblems[i].id, order: i },
    });
  }

  console.log("Sheets created!");
  
  const totalProblems = await prisma.problem.count();
  const totalSheets = await prisma.topicSheet.count();
  console.log(`\nTotal: ${totalProblems} problems, ${totalSheets} sheets`);
}

quickImport()
  .catch(console.error)
  .finally(() => prisma.$disconnect());