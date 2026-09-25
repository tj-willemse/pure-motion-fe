"use client";

import { useState } from "react";
import { Apple } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type OAuthProvider = "google" | "apple";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.9A6.02 6.02 0 0 1 6.07 12c0-.66.11-1.3.32-1.9V7.51H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.49l3.35-2.59Z" />
      <path fill="#EA4335" d="M12 5.97c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.51l3.35 2.59C7.18 7.73 9.39 5.97 12 5.97Z" />
    </svg>
  );
}

export function SocialAuthButtons() {
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);

  async function continueWith(provider: OAuthProvider) {
    setPendingProvider(provider);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setPendingProvider(null);
      const providerName = provider === "google" ? "Google" : "Apple";
      toast.error(`${providerName} sign-in is not available yet. Please use email or try again later.`);
    }
  }

  return (
    <div className="social-auth">
      <div className="social-auth-buttons">
        <button
          type="button"
          className="social-auth-button"
          onClick={() => continueWith("google")}
          disabled={pendingProvider !== null}
          aria-busy={pendingProvider === "google"}
        >
          {pendingProvider === "google" ? <span className="button-spinner" /> : <GoogleMark />}
          Continue with Google
        </button>
        <button
          type="button"
          className="social-auth-button"
          onClick={() => continueWith("apple")}
          disabled={pendingProvider !== null}
          aria-busy={pendingProvider === "apple"}
        >
          {pendingProvider === "apple" ? <span className="button-spinner" /> : <Apple size={19} strokeWidth={2.2} />}
          Continue with Apple
        </button>
      </div>
      <div className="auth-divider" aria-hidden="true">
        <span>or continue with email</span>
      </div>
    </div>
  );
}
