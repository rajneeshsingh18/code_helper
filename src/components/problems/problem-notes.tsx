"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveUserNote } from "@/server/actions/notes";
import { Save, Loader2 } from "lucide-react";

interface ProblemNotesProps {
  problemId: string;
  initialContent: string;
}

export function ProblemNotes({ problemId, initialContent }: ProblemNotesProps) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveUserNote(problemId, content);
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Personal Notes</CardTitle>
        <Button 
          size="sm" 
          onClick={handleSave} 
          disabled={isPending || content === initialContent}
          className="h-8 gap-2"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          Save
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Write your notes, thoughts, or reminders here..."
          className="min-h-[150px] text-sm resize-none focus-visible:ring-primary"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
