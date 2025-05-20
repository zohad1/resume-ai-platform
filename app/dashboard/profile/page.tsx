// ✅ File: app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { User, Mail, Linkedin, Camera, Save, CheckCircle, Globe, Github } from "lucide-react";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    image_url: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail);

        // 🔧 Ensure no null values exist in inputs
        const sanitized = {
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          linkedin: data.linkedin ?? "",
          github: data.github ?? "",
          website: data.website ?? "",
          image_url: data.image_url ?? "",
        };

        setProfileData(sanitized);
      } catch (error: any) {
        toast.error("Failed to load profile", { description: error.message });
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      toast.success("Profile updated successfully");
      setIsSaved(true);
    } catch (error: any) {
      toast.error("Failed to update profile", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/profile/upload-photo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      setProfileData((prev) => ({ ...prev, image_url: data.image_url ?? "" }));
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error("Upload failed", { description: error.message });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader avatarUrl={profileData.image_url ?? ""} />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <Button
            onClick={handleSave}
            disabled={isLoading || isSaved}
            className={isSaved ? "bg-green-600 hover:bg-green-700" : "bg-emerald-600 hover:bg-emerald-700"}
          >
            {isLoading ? (
              "Saving..."
            ) : isSaved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Saved
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.image_url || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">
                      {(profileData.name || "N/A")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="relative">
                    <input
                      type="file"
                      id="profile-image"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Label
                      htmlFor="profile-image"
                      className="flex items-center gap-2 text-sm cursor-pointer text-emerald-600 hover:text-emerald-700"
                    >
                      <Camera className="h-4 w-4" /> Change Photo
                    </Label>
                  </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div className="grid gap-2">
                    <Label htmlFor="name"><User className="h-4 w-4 mr-1 inline" />Full Name</Label>
                    <Input id="name" name="name" value={profileData.name ?? ""} onChange={handleInputChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={profileData.phone ?? ""} onChange={handleInputChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email"><Mail className="h-4 w-4 mr-1 inline" />Email Address (read-only)</Label>
                    <Input id="email" name="email" value={profileData.email ?? ""} disabled />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="linkedin"><Linkedin className="h-4 w-4 mr-1 inline" />LinkedIn</Label>
                    <Input id="linkedin" name="linkedin" value={profileData.linkedin ?? ""} onChange={handleInputChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="github"><Github className="h-4 w-4 mr-1 inline" />GitHub</Label>
                    <Input id="github" name="github" value={profileData.github ?? ""} onChange={handleInputChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website"><Globe className="h-4 w-4 mr-1 inline" />Website</Label>
                    <Input id="website" name="website" value={profileData.website ?? ""} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  );
}
