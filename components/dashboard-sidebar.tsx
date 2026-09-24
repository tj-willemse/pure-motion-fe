"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signOut } from "@/app/auth/actions";
import { dashboardNavigation, type DashboardRole } from "@/lib/dashboard-navigation";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

type DashboardSidebarProps = {
  name: string;
  email: string;
  role: DashboardRole;
};

export function DashboardSidebar({ name, email, role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isNavigating, startNavigation] = useTransition();
  const nav = dashboardNavigation[role];
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <button
        className="dashboard-mobile-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close dashboard menu" : "Open dashboard menu"}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside className={`dashboard-sidebar${open ? " is-open" : ""}`}>
        <Link href="/" className="dashboard-brand" aria-label="Pure Motion Golf website">
          <Image
            src="/brand/pure-motion-wordmark.webp"
            alt="Pure Motion Golf Academy"
            width={2025}
            height={573}
            priority
          />
        </Link>

        <nav className="dashboard-nav" aria-label="Portal navigation">
          {nav.map((item) => {
            const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : ""}
                aria-current={active ? "page" : undefined}
                onClick={(event) => {
                  setOpen(false);
                  if (!active && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
                    event.preventDefault();
                    startNavigation(() => router.push(item.href));
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-account">
          <div className="dashboard-avatar" aria-hidden="true">{initials || "PM"}</div>
          <div>
            <strong>{name || "Pure Motion member"}</strong>
            <span>{email}</span>
            <small>{role}</small>
          </div>
        </div>
        <form action={signOut}>
          <PendingSubmitButton className="dashboard-signout" pendingLabel="Signing out…">
            Sign out <LogOut size={16} />
          </PendingSubmitButton>
        </form>
      </aside>
      {open && <button className="dashboard-sidebar-scrim" type="button" aria-label="Close dashboard menu" onClick={() => setOpen(false)} />}
      {isNavigating && <DashboardSkeleton navigation />}
    </>
  );
}
