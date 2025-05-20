import type React from "react"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Resume Parser",
  description: "AI-powered resume parsing application",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="resume-parser-theme">
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
