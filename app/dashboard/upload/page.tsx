"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, X, Check, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)
    setUploadStatus("uploading")

    try {
      const token = localStorage.getItem("token") // ✅ must match your login store key
      if (!token) throw new Error("No access token found")

      const formData = new FormData()
      formData.append("file", files[0])

      const res = await fetch("http://127.0.0.1:8000/resumes/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // ✅ Attach correct token
        },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || "Upload failed")
      }

      const result = await res.json()
      localStorage.setItem("parsed_resume_id", result.data.id)

      setUploadProgress(100)
      setUploadStatus("success")

      // Redirect after slight delay
      setTimeout(() => {
        router.push("/dashboard/parsing-results")
      }, 1000)
    } catch (err: any) {
      console.error("Upload error:", err.message)
      setUploadStatus("error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <h1 className="text-3xl font-bold">Upload Resumes</h1>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>PDF or DOCX files supported</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Browse File
            </Button>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded p-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {uploadStatus !== "idle" && (
              <div className="mt-6 space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm">
                  {uploadStatus === "uploading" && "Uploading..."}
                  {uploadStatus === "success" && (
                    <span className="text-green-600 flex items-center">
                      <Check className="mr-1 h-4 w-4" /> Upload complete
                    </span>
                  )}
                  {uploadStatus === "error" && (
                    <span className="text-red-600 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" /> Upload failed
                    </span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="bg-emerald-600"
            >
              {uploading ? "Uploading..." : "Upload & Parse"}
            </Button>
          </CardFooter>
        </Card>
      </DashboardShell>
    </div>
  )
}
