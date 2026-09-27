import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth-next";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(`/reset-password?next=${encodeURIComponent(next)}`, request.url));
  }
  return NextResponse.redirect(new URL(`/forgot-password?next=${encodeURIComponent(next)}&error=${encodeURIComponent("This reset link is invalid or expired. Request another link and open it in the browser you used to request it.")}`, request.url));
}
