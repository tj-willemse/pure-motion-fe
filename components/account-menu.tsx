"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/auth/actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";

export function AccountMenu() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const container = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (container.current) container.current.open = false;
  }, [pathname]);

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (container.current && !container.current.contains(event.target as Node)) container.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && container.current?.open) {
        container.current.open = false;
        container.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  if (!signedIn) return <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="portal-link" aria-label="Sign in to your profile"><UserRound size={18} aria-hidden="true" /></Link>;

  return <details ref={container} className="account-menu">
    <summary className="portal-link" aria-label="Account options"><UserRound size={18} aria-hidden="true" /></summary>
    <div className="account-menu-panel">
        <Link href="/dashboard" onClick={() => { if (container.current) container.current.open = false; }}><LayoutDashboard size={17} aria-hidden="true" /> My dashboard</Link>
        <form action={signOut}><PendingSubmitButton className="account-menu-signout" pendingLabel="Signing out…"><LogOut size={17} aria-hidden="true" /> Sign out</PendingSubmitButton></form>
    </div>
  </details>;
}
