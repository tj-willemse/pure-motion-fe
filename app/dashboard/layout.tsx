import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { requireDashboardUser } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireDashboardUser();
  const name = [user.profile.firstName, user.profile.lastName].filter(Boolean).join(" ");

  return (
    <div className="dashboard-shell">
      <DashboardSidebar name={name} email={user.email} role={user.role} />
      <div className="dashboard-workspace">
        {children}
      </div>
    </div>
  );
}
