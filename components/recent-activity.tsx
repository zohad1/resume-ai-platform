import { FileText, Upload, Search, Clock } from "lucide-react"

interface ResumeActivity {
  id: number
  email: string
  phone: string
  created_at?: string // optional if you plan to enhance time logic
}

interface RecentActivityProps {
  resumes: ResumeActivity[]
}

export function RecentActivity({ resumes }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      {resumes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No recent activity found.</p>
      ) : (
        resumes.map((resume) => (
          <div key={resume.id} className="flex items-start gap-4">
            <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
              <Upload className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Uploaded resume for <span className="text-emerald-700">{resume.email}</span>
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                Just now{/* Placeholder. You can replace with relative time if needed */}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
