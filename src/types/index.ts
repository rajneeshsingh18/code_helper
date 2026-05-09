import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProgressStatus = "Todo" | "Attempted" | "Solved";

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  examples: string;
  constraints: string;
  testCases: string;
  starterCode: string;
  solution: string;
  videoUrl?: string | null;
  topics: Topic[];
  companies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
}

export interface TopicSheet {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  problems: Problem[];
}

export interface UserProgress {
  id: string;
  userId: string;
  problemId: string;
  status: ProgressStatus;
  code?: string | null;
  lastAttempt?: Date | null;
}

export interface Bookmark {
  id: string;
  problemId: string;
}

export interface UserNote {
  id: string;
  problemId: string;
  content: string;
}

export interface DashboardStats {
  totalSolved: number;
  totalAttempted: number;
  totalTodo: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  longestStreak: number;
}