import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Easy":
      return "text-green-500 bg-green-500/10";
    case "Medium":
      return "text-yellow-500 bg-yellow-500/10";
    case "Hard":
      return "text-red-500 bg-red-500/10";
    default:
      return "text-gray-500 bg-gray-500/10";
  }
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
