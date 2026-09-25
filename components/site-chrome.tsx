"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteChrome({ position }: { position: "header" | "footer" }) {
  const pathname = usePathname();

  if (
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) return null;

  return position === "header" ? <SiteHeader /> : <SiteFooter />;
}
