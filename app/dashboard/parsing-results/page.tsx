"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Check, Edit, Save } from "lucide-react"

export default function ParsingResultsPage() {
  const router = useRouter()
  const [resume, setResume] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    const fetchParsedResume = async () => {
      const resumeId = localStorage.getItem("parsed_resume_id")
      const token = localStorage.getItem("token")

      if (!resumeId || !token) {
        console.warn("Missing resume ID or token in localStorage.")
        localStorage.removeItem("parsed_resume_id")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/resumes/view/${resumeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || "Resume not found")

        setResume(data)
      } catch (err: any) {
        console.error("❌ Resume fetch error:", err.message)
        localStorage.removeItem("parsed_resume_id")
      } finally {
        setLoading(false)
      }
    }

    fetchParsedResume()
  }, [])

  const handleSave = async () => {
    const resumeId = localStorage.getItem("parsed_resume_id")
    const token = localStorage.getItem("token")
    if (!resumeId || !token) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/resumes/update/${resumeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: resume.email,
          phone: resume.phone,
          skills: resume.skills,
          education: resume.education,
          experience: resume.experience,
        }),
      })

      if (!res.ok) throw new Error("Failed to save resume changes")
      setEditMode(false)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  const safe = (val?: string | null) => (val && val.trim() ? val : "")

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader />
        <p className="p-4">Loading resume data...</p>
      </DashboardShell>
    )
  }

  if (!resume) {
    return (
      <DashboardShell>
        <DashboardHeader />
        <p className="p-4 text-red-500">No resume found. Please upload again.</p>
      </DashboardShell>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Parsing Results</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Skip to Dashboard</Button>
        </div>

        <Card className="mt-6">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Parsed Resume</CardTitle>
              <CardDescription>Review and confirm extracted data</CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              <Progress value={92} className="h-2 w-24" />
              <span className="text-sm">92%</span>
              {!editMode ? (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              ) : (
                <Button size="sm" className="bg-emerald-600" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="raw">Raw Text</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {[
                  "email",
                  "phone",
                  "skills",
                  "education",
                  "experience",
                ].map((key) => (
                  <div key={key}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </h3>
                    {editMode ? (
                      <textarea
                        className="w-full text-black p-2 rounded-md"
                        rows={key === "skills" || key === "experience" || key === "education" ? 4 : 1}
                        value={resume[key] || ""}
                        onChange={(e) =>
                          setResume((prev: any) => ({ ...prev, [key]: e.target.value }))
                        }
                      />
                    ) : (
                      <p className="whitespace-pre-wrap font-medium">{safe(resume[key])}</p>
                    )}
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

          <CardFooter className="flex justify-end">
            <Button className="bg-emerald-600" onClick={() => router.push("/dashboard")}>Finish <Check className="ml-2 h-4 w-4" /></Button>
          </CardFooter>
        </Card>
      </DashboardShell>
    </div>
  )
}
