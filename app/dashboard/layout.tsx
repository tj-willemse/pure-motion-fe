import type { Metadata } from "next";
import Link from "next/link";
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
        <header className="dashboard-topbar">
          <div>
            <span>{user.role === "client" ? "Member portal" : `${user.role} portal`}</span>
            <strong>{name || user.email}</strong>
          </div>
          <LinkToWebsite />
        </header>
        {children}
      </div>
    </div>
  );
}

function LinkToWebsite() {
  return <Link href="/">View website</Link>;
}
