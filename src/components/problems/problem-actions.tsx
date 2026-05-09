"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, CheckCircle2 } from "lucide-react";
import { toggleBookmark, updateProgress } from "@/server/actions/progress";
import { ProgressStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProblemActionsProps {
  problemId: string;
  isBookmarked: boolean;
  status: ProgressStatus | null;
}

export function ProblemActions({ problemId, isBookmarked, status }: ProblemActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBookmark = () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    startTransition(async () => {
      await toggleBookmark(problemId);
    });
  };

  const handleToggleSolved = () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    const newStatus = status === "Solved" ? "Todo" : "Solved";
    startTransition(async () => {
      await updateProgress(problemId, newStatus as ProgressStatus);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1"
        onClick={handleBookmark}
        disabled={isPending}
      >
        <Bookmark className={isBookmarked ? "h-4 w-4 mr-2 fill-yellow-500 text-yellow-500" : "h-4 w-4 mr-2"} />
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1"
        onClick={handleToggleSolved}
        disabled={isPending}
      >
        <CheckCircle2 className={status === "Solved" ? "h-4 w-4 mr-2 text-green-500" : "h-4 w-4 mr-2"} />
        {status === "Solved" ? "Solved" : "Mark as Solved"}
      </Button>
    </div>
  );
}
