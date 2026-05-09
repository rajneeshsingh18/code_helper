"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Database } from "lucide-react";
import * as XLSX from "xlsx";

interface ProblemRow {
  title?: string;
  slug?: string;
  difficulty?: string;
  description?: string;
  examples?: string;
  constraints?: string;
  testCases?: string;
  starterCode?: string;
  solution?: string;
  videoUrl?: string;
  topics?: string;
  companies?: string;
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [leetcodeImporting, setLeetcodeImporting] = useState(false);
  const [leetcodeResult, setLeetcodeResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".csv"))) {
      setFile(selectedFile);
      setResults(null);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResults(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<ProblemRow>(worksheet);

      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        if (!row.title || !row.slug || !row.difficulty) {
          errors.push(`Row ${i + 2}: Missing required fields (title, slug, difficulty)`);
          failed++;
          continue;
        }

        try {
          const res = await fetch("/api/admin/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: row.title,
              slug: row.slug,
              difficulty: row.difficulty,
              description: row.description || "",
              examples: row.examples || "[]",
              constraints: row.constraints || "[]",
              testCases: row.testCases || "[]",
              starterCode: row.starterCode || "",
              solution: row.solution || "",
              videoUrl: row.videoUrl || "",
              topics: row.topics ? row.topics.split(",").map(t => t.trim()) : [],
              companies: row.companies ? row.companies.split(",").map(c => c.trim()) : [],
            }),
          });

          if (res.ok) {
            success++;
          } else {
            const data = await res.json();
            errors.push(`Row ${i + 2}: ${data.error || "Failed to import"}`);
            failed++;
          }
        } catch (err) {
          errors.push(`Row ${i + 2}: Network error`);
          failed++;
        }

        setProgress(Math.round(((i + 1) / rows.length) * 100));
      }

      setResults({ success, failed, errors: errors.slice(0, 10) });
    } catch (err) {
      console.error("Error processing file:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Import problems from XLSX or CSV files</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Problems</CardTitle>
            <CardDescription>
              Upload an XLSX or CSV file with problem data. Required columns: title, slug, difficulty
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Spreadsheet</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileSpreadsheet className="h-5 w-5" />
                <span className="flex-1">{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {results && (
              <div className={`p-4 rounded-lg ${results.failed > 0 ? "bg-yellow-500/10" : "bg-green-500/10"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {results.failed > 0 ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  <span className="font-medium">
                    {results.success} problems imported successfully
                    {results.failed > 0 && `, ${results.failed} failed`}
                  </span>
                </div>
                {results.errors.length > 0 && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {results.errors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button onClick={processFile} disabled={!file || uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Importing..." : "Import Problems"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Import from LeetCode Database
            </CardTitle>
            <CardDescription>
              Import problems from the included LeetCode problems spreadsheet (3671 problems)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leetcodeResult && (
              <div className={`p-4 rounded-lg ${leetcodeResult.errors?.length > 0 ? "bg-yellow-500/10" : "bg-green-500/10"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">
                    Import complete! {leetcodeResult.imported} problems imported, {leetcodeResult.skipped} skipped
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Created {leetcodeResult.totalTopics} topics and {leetcodeResult.totalPatterns} patterns
                </p>
                {leetcodeResult.errors?.length > 0 && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {leetcodeResult.errors.slice(0, 5).map((err: string, i: number) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button 
              onClick={async () => {
                setLeetcodeImporting(true);
                setLeetcodeResult(null);
                try {
                  const res = await fetch("/api/admin/import-leetcode", { method: "POST" });
                  const data = await res.json();
                  setLeetcodeResult(data);
                } catch (err) {
                  console.error(err);
                } finally {
                  setLeetcodeImporting(false);
                }
              }} 
              disabled={leetcodeImporting}
            >
              <Database className="h-4 w-4 mr-2" />
              {leetcodeImporting ? "Importing 3671 problems..." : "Import LeetCode Problems"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expected Format</CardTitle>
            <CardDescription>
              Your spreadsheet should have the following columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-3 gap-2 font-medium p-2 bg-muted rounded">
                <span>Column</span>
                <span>Required</span>
                <span>Description</span>
              </div>
              {[
                ["title", "Yes", "Problem title"],
                ["slug", "Yes", "URL-friendly slug (e.g., two-sum)"],
                ["difficulty", "Yes", "Easy, Medium, or Hard"],
                ["description", "No", "Problem description (supports HTML)"],
                ["examples", "No", "JSON array of examples"],
                ["constraints", "No", "JSON array of constraints"],
                ["testCases", "No", "JSON array of test cases"],
                ["starterCode", "No", "Starting code for the editor"],
                ["solution", "No", "Solution code"],
                ["videoUrl", "No", "Link to video solution"],
                ["topics", "No", "Comma-separated topic names"],
                ["companies", "No", "Comma-separated company tags"],
              ].map(([col, req, desc]) => (
                <div key={col} className="grid grid-cols-3 gap-2 p-2">
                  <span className="font-mono">{col}</span>
                  <span>{req === "Yes" ? "✓" : "✗"}</span>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}