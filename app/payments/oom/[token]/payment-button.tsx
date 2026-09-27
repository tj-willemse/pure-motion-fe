"use client";

import { useState, useTransition } from "react";
import { startPayment } from "./actions";

export function PaymentButton({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return <div>
    <button type="button" className="button" disabled={pending} onClick={() => startTransition(async () => {
      setError("");
      const result = await startPayment(token);
      if (result.url) window.location.assign(result.url);
      else setError(result.error || "Unable to start checkout.");
    })}>{pending ? "Opening secure checkout…" : "Continue to Yoco checkout"}</button>
    {error && <p role="alert">{error}</p>}
  </div>;
}
