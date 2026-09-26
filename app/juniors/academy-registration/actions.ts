"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const requiredText = z.string().trim().min(1);
const registrationSchema = z.object({
  registration_type: z.enum(["returning", "assessed", "waived", "re-enrollment"]),
  parent_first_name: requiredText,
  parent_last_name: requiredText,
  parent_email: z.string().trim().email(),
  junior_first_name: requiredText,
  junior_last_name: requiredText,
});

export async function submitAcademyRegistration(formData: FormData) {
  if (String(formData.get("website") ?? "")) redirect("/juniors/academy-registration?message=Registration%20received.");

  const payload = Object.fromEntries(
    [...formData.entries()].filter(([key]) => key !== "website" && key !== "heard_about"),
  ) as Record<string, FormDataEntryValue | string[]>;
  payload.heard_about = formData.getAll("heard_about").map(String);

  const parsed = registrationSchema.safeParse(payload);
  if (!parsed.success) {
    redirect("/juniors/academy-registration?error=Please%20complete%20all%20required%20registration%20details.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_junior_academy_registration", { payload });
  if (error) {
    redirect("/juniors/academy-registration?error=We%20could%20not%20save%20the%20registration.%20Please%20try%20again.");
  }

  redirect("/juniors/academy-registration?message=Registration%20received.%20The%20academy%20team%20will%20confirm%20the%20programme%20and%20payment%20details.");
}
