import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      difficulty,
      description,
      examples,
      constraints,
      testCases,
      starterCode,
      solution,
      videoUrl,
      timeComplexity,
      spaceComplexity,
      topics,
      companies,
    } = body;

    if (!title || !slug || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, difficulty" },
        { status: 400 }
      );
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return NextResponse.json(
        { error: "Difficulty must be Easy, Medium, or Hard" },
        { status: 400 }
      );
    }

    const existingProblem = await db.problem.findUnique({
      where: { slug },
    });

    if (existingProblem) {
      return NextResponse.json(
        { error: `Problem with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    let topicConnections: { connect: { id: string } }[] = [];
    if (topics && Array.isArray(topics)) {
      const dbTopics = await db.topic.findMany({
        where: { name: { in: topics } },
      });
      topicConnections = dbTopics.map((t) => ({ connect: { id: t.id } }));
    }

    const problem = await db.problem.create({
      data: {
        title,
        slug,
        difficulty,
        description: description || "",
        examples: examples || "[]",
        constraints: constraints || "[]",
        testCases: testCases || "[]",
        starterCode: starterCode || "",
        solution: solution || "",
        videoUrl: videoUrl || null,
        timeComplexity: timeComplexity || null,
        spaceComplexity: spaceComplexity || null,
        companies: companies || [],
        topics: {
          connect: topicConnections.map((t) => t.connect),
        },
      },
    });

    return NextResponse.json({ problem });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}