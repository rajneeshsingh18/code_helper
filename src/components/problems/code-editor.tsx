"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Play, Send, RotateCcw, Loader2 } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-muted/10 min-h-[400px]">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
});

interface CodeEditorProps {
  initialCode: string;
  problemId: string;
  onRun?: (code: string) => void;
  onSubmit?: (code: string) => void;
}

export function CodeEditor({ initialCode, problemId, onRun, onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const { theme } = useTheme();

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            JavaScript
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCode(initialCode)}
            title="Reset to starter code"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
      <div className="flex items-center justify-end gap-2 p-4 border-t bg-muted/30">
        <Button variant="outline" size="sm" onClick={() => onRun?.(code)} className="gap-2">
          <Play className="h-4 w-4" />
          Run
        </Button>
        <Button size="sm" onClick={() => onSubmit?.(code)} className="gap-2">
          <Send className="h-4 w-4" />
          Submit
        </Button>
      </div>
    </div>
  );
}
