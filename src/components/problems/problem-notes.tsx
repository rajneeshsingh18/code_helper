"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveUserNote } from "@/server/actions/notes";
import { Save, Loader2, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProblemNotesProps {
  problemId: string;
  initialContent: string;
}

export function ProblemNotes({ problemId, initialContent }: ProblemNotesProps) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSave = () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    startTransition(async () => {
      try {
        await saveUserNote(problemId, content);
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          {!session && <Lock className="h-3 w-3" />}
          Personal Notes
        </CardTitle>
        <Button 
          size="sm" 
          onClick={handleSave} 
          disabled={isPending || content === initialContent || !session}
          className="h-7 px-3 text-[10px] font-bold uppercase tracking-wider gap-2"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          Save
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Textarea
          placeholder={session ? "Write your notes, thoughts, or reminders here..." : "Please sign in to save personal notes for this problem."}
          className="h-full min-h-[150px] text-sm resize-none focus-visible:ring-0 border-0 bg-transparent rounded-none px-4 py-2 placeholder:text-muted-foreground/30"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!session}
        />
      </CardContent>
    </Card>
  );
}
