"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Check, ArrowLeft } from "lucide-react"

export default function ResumeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [resume, setResume] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResume = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`http://127.0.0.1:8000/resumes/view/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || "Resume not found")
        setResume(data)
      } catch (err) {
        console.error("Error fetching resume:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
  }, [id])

  const safe = (val?: string | null) => (val && val.trim() ? val : "N/A")

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader />
        <p className="p-4">Loading resume details...</p>
      </DashboardShell>
    )
  }

  if (!resume) {
    return (
      <DashboardShell>
        <DashboardHeader />
        <p className="p-4 text-red-500">Resume not found.</p>
      </DashboardShell>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Resume Detail</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{resume.email}</CardTitle>
            <CardDescription>{resume.phone}</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="raw">Raw Text</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {["skills", "education", "experience"].map((key) => (
                  <div key={key}>
                    <h3 className="text-sm font-semibold text-muted-foreground capitalize">
                      {key}
                    </h3>
                    <p className="whitespace-pre-wrap font-medium text-foreground">
                      {safe(resume[key])}
                    </p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="raw">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Full Resume Text</h3>
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
                  {safe(resume.raw_text)}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DashboardShell>
    </div>
  )
}
