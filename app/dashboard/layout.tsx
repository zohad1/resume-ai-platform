// ✅ File: app/dashboard/layout.tsx
import { UserProfileProvider } from "@/context/UserProfileContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProfileProvider>
      {children}
    </UserProfileProvider>
  );
}
