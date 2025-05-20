import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, FileText, Upload, BarChart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ResumeAI</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              AI-Powered Resume Parsing <br className="hidden md:inline" />
              <span className="text-emerald-600">Made Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-[700px] mb-10">
              Extract, analyze, and organize resume data automatically with our advanced AI. Save time and make better
              hiring decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Upload className="h-10 w-10 text-emerald-600 mb-2" />
                  <CardTitle>Easy Upload</CardTitle>
                  <CardDescription>
                    Upload resumes in PDF or DOCX format with a simple drag and drop interface.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Support for batch uploads and automatic processing queue.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 text-emerald-600 mb-2" />
                  <CardTitle>Smart Parsing</CardTitle>
                  <CardDescription>
                    AI extracts key information including skills, experience, education, and contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced NLP algorithms ensure high accuracy and structured data.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart className="h-10 w-10 text-emerald-600 mb-2" />
                  <CardTitle>AI Analyzing</CardTitle>
                  <CardDescription>
                    Gain valuable insights with AI-powered analysis of resume data and candidate profiles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Identify trends, skill gaps, and top candidates with intelligent analytics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <span className="text-emerald-600 font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p className="text-muted-foreground">Create your account in seconds</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <span className="text-emerald-600 font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Resumes</h3>
                <p className="text-muted-foreground">Drag & drop PDF or DOCX files</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <span className="text-emerald-600 font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                <p className="text-muted-foreground">Our AI extracts and organizes data</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <span className="text-emerald-600 font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyze Results</h3>
                <p className="text-muted-foreground">Review insights and analytics</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <FileText className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold">ResumeAI</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
