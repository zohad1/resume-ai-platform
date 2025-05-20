// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Upload,
  BarChart,
  FileUp,
  Filter,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { ResumeStats } from "@/components/resume-stats";
import { RecentActivity } from "@/components/recent-activity";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [recentResumes, setRecentResumes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; total: number }[]>([]);
  const [storage, setStorage] = useState({ used_mb: 0, total_mb: 50 });
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/dashboard/recent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to load dashboard");

        setRecentResumes(data.activity || []);
        setTotal(data.total_resumes);
        setToday(data.parsed_today);
        setSkills(data.top_skills);
        setStorage(data.storage_used);
        setMonthlyData(data.resume_stats || []);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to load dashboard:", err.message);
        } else {
          console.error("Failed to load dashboard:", err);
        }
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Link href="/dashboard/upload">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resumes">My Resumes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Metrics Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{total}</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Parsed Today</CardTitle>
                  <FileUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{today}</div>
                  <p className="text-xs text-muted-foreground">+1 from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{skills.length}</div>
                  <p className="text-xs text-muted-foreground">{skills.join(", ")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((storage.used_mb / storage.total_mb) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {storage.used_mb}MB of {storage.total_mb}MB used
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Resume Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResumeStats monthlyData={monthlyData} />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent resume parsing activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivity resumes={recentResumes} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resumes">
            <Card>
              <CardHeader>
                <CardTitle>My Resumes</CardTitle>
                <CardDescription>Manage all your uploaded and parsed resumes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="border rounded-md p-4 hover:bg-muted cursor-pointer"
                      onClick={() => router.push(`/dashboard/resume/${resume.id}`)}
                    >
                      <div className="font-medium">{resume.email}</div>
                      <div className="text-sm text-muted-foreground">{resume.phone}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View insights and statistics about your resume data</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analytics content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  );
}
