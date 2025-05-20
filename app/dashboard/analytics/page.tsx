"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AnalyticsPage() {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAnalyze = async () => {
    if (!skills || !experience || !education || files.length === 0) return;

    const formData = new FormData();
    formData.append("skills", skills);
    formData.append("experience", experience);
    formData.append("education", education);
    files.forEach((file) => formData.append("resumes", file));

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/analytics/match-full", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to process resumes");
      }

      const data = await res.json();
      setResults(data.matches);
      setShowDownload(true);
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const formData = new FormData();
    formData.append("skills", skills);
    formData.append("experience", experience);
    formData.append("education", education);
    files.forEach((file) => formData.append("resumes", file));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/analytics/match", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to download report");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume_match_report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">AI Job Matching</h1>
        </div>

        <div className="grid gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Provide Job Requirements</CardTitle>
              <CardDescription>
                Input job criteria and upload one or more resumes. A chart will display match accuracy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                placeholder="Required Skills (comma-separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full rounded border p-2 bg-white text-black dark:bg-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Experience Required (e.g., 2)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded border p-2 bg-white text-black dark:bg-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Preferred Education (e.g., Bachelor's, Master's)"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full rounded border p-2 bg-white text-black dark:bg-slate-900 dark:text-white"
              />
              <input
                type="file"
                multiple
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
              {showDownload && (
                <Button
                  className="bg-slate-800 hover:bg-slate-900"
                  onClick={handleDownload}
                >
                  Download AI Results PDF
                </Button>
              )}
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Match Accuracy Chart</CardTitle>
                <CardDescription>Score distribution of uploaded resumes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="filename" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardShell>
    </div>
  );
}
