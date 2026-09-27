"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { z } from "zod";
import { oomRounds, oomSeason } from "@/lib/order-of-merit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createYocoCheckout, paymentPath } from "@/lib/yoco";

const required = z.string().trim().min(1);
const registrationSchema = z.object({
  website: z.string().max(0).optional(),
  registration_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  parent_first_name: required,
  parent_last_name: required,
  relationship: required,
  parent_email: z.string().trim().email(),
  parent_phone: required,
  physical_address: required,
  alternate_transport: z.string().trim().max(500),
  discovery_sources: z.array(required).min(1),
  player_first_name: required,
  player_known_as: z.string().trim().max(100),
  player_last_name: required,
  player_gender: required,
  player_date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  player_school: required,
  player_grade: required,
  handicap_index: z.union([z.literal(""), z.coerce.number().min(0).max(54)]),
  coach_name: z.string().trim().max(150),
  dgc_member: z.boolean(),
  dgc_membership_number: z.string().trim().max(100),
  jam_member: z.boolean(),
  jam_membership_number: z.string().trim().max(100),
  player_social_media: z.string().trim().max(250),
  support_requirements: z.string().trim().max(1500),
  division: z.enum(["standard", "kickstarter"]),
  round_ids: z.array(required).min(1),
  image_consent: z.literal(true),
  terms_accepted: z.literal(true),
}).superRefine((value, context) => {
  if (value.dgc_member && !value.dgc_membership_number) {
    context.addIssue({ code: "custom", path: ["dgc_membership_number"], message: "Enter the DGC membership number." });
  }
  if (value.jam_member && !value.jam_membership_number) {
    context.addIssue({ code: "custom", path: ["jam_membership_number"], message: "Enter the Junior Academy membership number." });
  }

  const birthDate = new Date(`${value.player_date_of_birth}T00:00:00Z`);
  const age = oomSeason.year - birthDate.getUTCFullYear() -
    (birthDate.getUTCMonth() > 0 || birthDate.getUTCDate() > 1 ? 1 : 0);
  if (!Number.isFinite(age) || age < 6 || age > 18) {
    context.addIssue({ code: "custom", path: ["player_date_of_birth"], message: "The player must be aged 6 to 18 on 1 January 2026." });
  }
});

export type OomSubmissionResult = {
  ok: boolean;
  error?: string;
  reference?: string;
  totalCents?: number;
  paymentDeadline?: string;
  paymentUrl?: string;
  checkoutUrl?: string;
  warnings?: string[];
};

function string(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function boolean(formData: FormData, key: string) {
  return string(formData, key) === "true";
}

export async function submitOomRegistration(formData: FormData): Promise<OomSubmissionResult> {
  const supabase = await createClient();
  const claims = (await supabase.auth.getClaims()).data?.claims;
  if (!claims?.sub) return { ok: false, error: "Your session expired. Sign in again before submitting your registration." };
  if (string(formData, "website")) return { ok: true, reference: "received" };

  const parsed = registrationSchema.safeParse({
    website: string(formData, "website"),
    registration_date: string(formData, "registration_date"),
    parent_first_name: string(formData, "parent_first_name"),
    parent_last_name: string(formData, "parent_last_name"),
    relationship: string(formData, "relationship"),
    parent_email: string(formData, "parent_email"),
    parent_phone: string(formData, "parent_phone"),
    physical_address: string(formData, "physical_address"),
    alternate_transport: string(formData, "alternate_transport"),
    discovery_sources: formData.getAll("discovery_sources").map(String),
    player_first_name: string(formData, "player_first_name"),
    player_known_as: string(formData, "player_known_as"),
    player_last_name: string(formData, "player_last_name"),
    player_gender: string(formData, "player_gender"),
    player_date_of_birth: string(formData, "player_date_of_birth"),
    player_school: string(formData, "player_school"),
    player_grade: string(formData, "player_grade"),
    handicap_index: string(formData, "handicap_index"),
    coach_name: string(formData, "coach_name"),
    dgc_member: boolean(formData, "dgc_member"),
    dgc_membership_number: string(formData, "dgc_membership_number"),
    jam_member: boolean(formData, "jam_member"),
    jam_membership_number: string(formData, "jam_membership_number"),
    player_social_media: string(formData, "player_social_media"),
    support_requirements: string(formData, "support_requirements"),
    division: string(formData, "division"),
    round_ids: formData.getAll("round_ids").map(String),
    image_consent: boolean(formData, "image_consent"),
    terms_accepted: boolean(formData, "terms_accepted"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the registration details." };
  }

  const selectedRounds = oomRounds.filter((round) => parsed.data.round_ids.includes(round.id));
  if (selectedRounds.length !== new Set(parsed.data.round_ids).size || selectedRounds.some((round) => round.status !== "open")) {
    return { ok: false, error: "One or more selected rounds are no longer available." };
  }

  const payload = {
    ...parsed.data,
    season_id: oomSeason.id,
    handicap_index: parsed.data.handicap_index === "" ? "" : String(parsed.data.handicap_index),
  };

  const { data, error } = await supabase.rpc("submit_oom_registration", { payload });
  if (error || !data) {
    const message = error?.message?.includes("already registered")
      ? "This player is already registered for one or more selected rounds."
      : error?.message?.includes("fully booked")
        ? "One of the selected rounds has just filled. Please refresh and choose another date."
        : "We could not save the registration. Please try again or contact the academy.";
    return { ok: false, error: message };
  }

  const result = data as { id: string; reference: string; total_cents: number; payment_deadline: string };
  const warnings: string[] = [];
  const photoValue = formData.get("leaderboard_photo");
  if (photoValue instanceof File && photoValue.size > 0) {
    const acceptedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!acceptedPhotoTypes.has(photoValue.type) || photoValue.size > 5 * 1024 * 1024) {
      warnings.push("The registration was saved, but the photograph was not uploaded. Use a JPG, PNG or WebP file under 5 MB.");
    } else {
      const admin = createAdminClient();
      if (!admin) {
        warnings.push("The registration was saved, but photograph upload is not configured yet.");
      } else {
        const photoPath = `${result.id}/${crypto.randomUUID()}.webp`;
        let webp: Buffer | null = null;
        try {
          webp = await sharp(Buffer.from(await photoValue.arrayBuffer()), {
            failOn: "error",
            limitInputPixels: 40_000_000,
          })
            .rotate()
            .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
            .webp({ quality: 82, effort: 4 })
            .toBuffer();
        } catch {
          warnings.push("The registration was saved, but the photograph could not be processed as a valid image.");
        }

        const upload = webp
          ? await admin.storage.from("oom-player-photos").upload(photoPath, webp, {
              contentType: "image/webp",
              cacheControl: "31536000",
              upsert: false,
            })
          : null;
        if (upload?.error) {
          warnings.push("The registration was saved, but the photograph could not be uploaded.");
        } else if (upload) {
          const update = await admin.from("oom_registrations").update({ leaderboard_photo_path: photoPath }).eq("id", result.id);
          if (update.error) warnings.push("The photograph uploaded, but could not be linked to the registration.");
        }
      }
    }
  }

  const paymentUrl = paymentPath(result.id);
  let checkoutUrl: string | undefined;
  if (paymentUrl) {
    try {
      checkoutUrl = await createYocoCheckout(paymentUrl.split("/").pop()!);
    } catch {
      warnings.push("Checkout could not be opened. Your entry is awaiting payment; retry using the payment link below without submitting another entry.");
    }
  }

  revalidatePath("/dashboard/order-of-merit");
  return {
    ok: true,
    reference: result.reference,
    totalCents: result.total_cents,
    paymentDeadline: result.payment_deadline,
    paymentUrl: paymentUrl ?? undefined,
    checkoutUrl,
    warnings,
  };
}
