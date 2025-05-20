"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";

export default function SettingsPage() {
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/settings/delete-account", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Account deletion failed");
    }

    alert("Your account has been deleted successfully.");
    // Redirect to login or landing page
    window.location.href = "/login";
  } catch (err: any) {
    console.error("Delete error:", err);
    alert("Something went wrong while deleting your account.");
  }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <div className="grid gap-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>Delete your account and remove all associated data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  );
}
