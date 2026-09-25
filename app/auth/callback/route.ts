import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function requestOrigin(request: NextRequest) {
  const { origin } = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto") ?? "https";

  return forwardedHost ? `${forwardedProtocol}://${forwardedHost}` : origin;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));
  const origin = requestOrigin(request);
  const providerError = searchParams.get("error_description");

  if (providerError) {
    const destination = new URL("/login", origin);
    destination.searchParams.set("error", "Social sign-in was cancelled or could not be completed.");
    return NextResponse.redirect(destination);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination = new URL(next, origin);
      destination.searchParams.set("message", "Welcome to your Pure Motion account.");
      return NextResponse.redirect(destination);
    }
  }

  const destination = new URL("/login", origin);
  destination.searchParams.set("error", "The sign-in link is invalid or has expired. Please try again.");
  return NextResponse.redirect(destination);
}
