import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPrimaryRole } from "@/lib/dashboard-navigation";

export async function requireDashboardUser() {
  const supabase = await createClient();
  const claims = (await supabase.auth.getClaims()).data?.claims;

  if (!claims?.sub) redirect("/portal?error=Please%20sign%20in%20to%20continue.");

  const [profileResult, rolesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,first_name,last_name,email,phone,is_active")
      .eq("id", claims.sub)
      .maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", claims.sub),
  ]);

  const roles = rolesResult.data?.map(({ role }) => role) ?? ["client"];
  const profile = profileResult.data;

  return {
    supabase,
    userId: claims.sub,
    email: profile?.email || (typeof claims.email === "string" ? claims.email : ""),
    profile: {
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      phone: profile?.phone ?? "",
      active: profile?.is_active ?? true,
    },
    roles,
    role: getPrimaryRole(roles),
  };
}
