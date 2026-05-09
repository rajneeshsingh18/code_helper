"use server";

import { getProblems } from "@/server/services/problem.service";

export async function fetchMoreProblems(
  difficulty?: string, 
  topic?: string, 
  search?: string, 
  cursor?: string
) {
  return await getProblems(difficulty, topic, search, 50, cursor);
}
