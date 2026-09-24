"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Your password must contain at least 8 characters."),
});

const registrationSchema = loginSchema.extend({
  firstName: z.string().trim().min(1, "Enter your first name."),
  lastName: z.string().trim().min(1, "Enter your surname."),
});

function portalRedirect(type: "error" | "message", message: string, path = "/portal"): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export async function signIn(formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) portalRedirect("error", result.error.issues[0].message);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) portalRedirect("error", "We could not sign you in with those details.");

  revalidatePath("/", "layout");
  redirect("/portal");
}

export async function register(formData: FormData) {
  const result = registrationSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    portalRedirect("error", result.error.issues[0].message, "/portal/register");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/portal`,
      data: {
        first_name: result.data.firstName,
        last_name: result.data.lastName,
      },
    },
  });

  if (error) portalRedirect("error", error.message, "/portal/register");

  portalRedirect(
    "message",
    "Check your email to confirm your Pure Motion account.",
    "/portal",
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/portal");
}
