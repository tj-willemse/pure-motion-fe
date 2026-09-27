"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth-next";
import { authErrorMessage } from "@/lib/auth-error-message";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Your password must contain at least 8 characters."),
});

const registrationSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name."),
    lastName: z.string().trim().min(1, "Enter your surname."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z
      .string()
      .min(10, "Use at least 10 characters for your password.")
      .regex(/[a-z]/, "Add a lowercase letter to your password.")
      .regex(/[A-Z]/, "Add an uppercase letter to your password.")
      .regex(/\d/, "Add a number to your password.")
      .regex(/[^A-Za-z0-9]/, "Add a symbol to your password."),
  });

function portalRedirect(type: "error" | "message", message: string, path = "/login", next = "/dashboard"): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}&next=${encodeURIComponent(next)}`);
}

function formText(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export async function signIn(formData: FormData) {
  const next = safeNext(formText(formData, "next"));
  const result = loginSchema.safeParse({
    email: formText(formData, "email"),
    password: formText(formData, "password"),
  });

  if (!result.success) portalRedirect("error", result.error.issues[0].message, "/login", next);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) portalRedirect("error", authErrorMessage(error, "signin"), "/login", next);

  revalidatePath("/", "layout");
  redirect(next);
}

export async function register(formData: FormData) {
  const next = safeNext(formText(formData, "next"));
  const result = registrationSchema.safeParse({
    firstName: formText(formData, "firstName"),
    lastName: formText(formData, "lastName"),
    email: formText(formData, "email"),
    password: formText(formData, "password"),
  });

  if (!result.success) {
    portalRedirect("error", result.error.issues[0].message, "/register", next);
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
      data: {
        first_name: result.data.firstName,
        last_name: result.data.lastName,
      },
    },
  });

  if (error) {
    console.error("Account signup failed", { code: error.code, status: error.status });
    portalRedirect(
      "error",
      authErrorMessage(error, "signup"),
      "/register", next,
    );
  }

  if (data.session) redirect(next);
  portalRedirect(
    "message",
    "Check your email to confirm your Pure Motion account.",
    "/login", next,
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  portalRedirect("message", "You have signed out.");
}

export async function requestPasswordReset(formData: FormData) {
  const next = safeNext(formText(formData, "next"));
  const email = z.string().trim().email().safeParse(formText(formData, "email"));
  if (!email.success) portalRedirect("error", "Enter a valid email address.", "/forgot-password", next);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${origin}/auth/recovery?next=${encodeURIComponent(next)}`,
  });
  if (error) portalRedirect("error", authErrorMessage(error, "recovery"), "/forgot-password", next);
  portalRedirect("message", "If an account exists for that email, you’ll receive a password reset link. Open it in this browser and check your spam folder too.", "/forgot-password", next);
}

export async function resetPassword(formData: FormData) {
  const next = safeNext(formText(formData, "next"));
  const password = registrationSchema.shape.password.safeParse(formText(formData, "password"));
  if (!password.success) portalRedirect("error", password.error.issues[0].message, "/reset-password", next);
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) portalRedirect("error", "Your reset session has expired. Request a new link.", "/forgot-password", next);
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) portalRedirect("error", authErrorMessage(error, "password"), "/reset-password", next);
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  portalRedirect("message", "Password updated. Sign in with your new password.", "/login", next);
}
