// ✅ File: context/UserProfileContext.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type UserProfileContextType = {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAvatarUrl(data.image_url ?? ""))
      .catch(() => setAvatarUrl(""));
  }, []);

  return (
    <UserProfileContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error("useUserProfile must be used within a UserProfileProvider");
  return context;
};
