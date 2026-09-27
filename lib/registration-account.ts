import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth-next";

export async function registrationAccount(next: string, required = true) {
  const supabase = await createClient();
  const claims = (await supabase.auth.getClaims()).data?.claims;
  if (!claims?.sub) {
    if (required) redirect(`/login?next=${encodeURIComponent(safeNext(next))}`);
    return null;
  }
  const [profile, family] = await Promise.all([
    supabase.from("profiles").select("first_name,last_name,phone,is_active").eq("id", claims.sub).maybeSingle(),
    supabase.from("dependents").select("id,first_name,last_name,date_of_birth").eq("client_id", claims.sub).order("first_name"),
  ]);
  if (profile.data?.is_active === false) throw new Error("Your account is inactive. Contact the academy.");
  return { firstName: profile.data?.first_name ?? "", lastName: profile.data?.last_name ?? "",
    email: typeof claims.email === "string" ? claims.email : "", phone: profile.data?.phone ?? "",
    family: family.data ?? [] };
}
