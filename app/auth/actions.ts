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
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match.",
    path: ["confirmPassword"],
  });

function portalRedirect(type: "error" | "message", message: string, path = "/portal"): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

function formText(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export async function signIn(formData: FormData) {
  const result = loginSchema.safeParse({
    email: formText(formData, "email"),
    password: formText(formData, "password"),
  });

  if (!result.success) portalRedirect("error", result.error.issues[0].message);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) portalRedirect("error", "We could not sign you in with those details.");

  revalidatePath("/", "layout");
  portalRedirect("message", "Welcome back.");
}

export async function register(formData: FormData) {
  const result = registrationSchema.safeParse({
    firstName: formText(formData, "firstName"),
    lastName: formText(formData, "lastName"),
    email: formText(formData, "email"),
    password: formText(formData, "password"),
    confirmPassword: formText(formData, "confirmPassword"),
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

  if (error) {
    portalRedirect(
      "error",
      "We could not create your account. Check your details or sign in if you already registered.",
      "/portal/register",
    );
  }

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
  portalRedirect("message", "You have signed out.");
}
