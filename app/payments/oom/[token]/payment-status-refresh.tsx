"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PaymentStatusRefresh() {
  const router = useRouter();
  useEffect(() => {
    // Stop automatic polling after two minutes; the manual refresh stays available.
    let attempts = 0;
    const interval = window.setInterval(() => {
      router.refresh();
      attempts += 1;
      if (attempts >= 24) window.clearInterval(interval);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [router]);
  return null;
}
