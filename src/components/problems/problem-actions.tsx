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
    <div className="flex items-center gap-3 w-full">
      <Button 
        variant="outline" 
        size="sm" 
        className={cn(
          "flex-1 h-10 font-bold uppercase tracking-wider text-[10px] border-white/10 transition-all",
          isBookmarked ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-white/5 hover:bg-white/10"
        )}
        onClick={handleBookmark}
        disabled={isPending}
      >
        <Bookmark className={cn("h-3.5 w-3.5 mr-2", isBookmarked && "fill-yellow-500")} />
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className={cn(
          "flex-1 h-10 font-bold uppercase tracking-wider text-[10px] border-white/10 transition-all",
          status === "Solved" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-white/5 hover:bg-white/10"
        )}
        onClick={handleToggleSolved}
        disabled={isPending}
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
        {status === "Solved" ? "Solved" : "Mark Solved"}
      </Button>
    </div>
  );
}
