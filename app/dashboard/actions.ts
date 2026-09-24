"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDashboardUser } from "@/lib/dashboard";

function text(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function dashboardRedirect(
  section: string,
  type: "error" | "message",
  message: string,
): never {
  const path = section ? `/dashboard/${section}` : "/dashboard";
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

async function recordAudit(
  supabase: Awaited<ReturnType<typeof requireDashboardUser>>["supabase"],
  actorId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata: Record<string, unknown> = {},
) {
  await supabase.from("audit_events").insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });
}

const profileSchema = z.object({
  firstName: z.string().min(1, "Enter your first name."),
  lastName: z.string().min(1, "Enter your surname."),
  phone: z.string().max(30, "Enter a valid phone number."),
});

export async function updateProfile(formData: FormData) {
  const user = await requireDashboardUser();
  const result = profileSchema.safeParse({
    firstName: text(formData, "firstName"),
    lastName: text(formData, "lastName"),
    phone: text(formData, "phone"),
  });

  if (!result.success) dashboardRedirect("profile", "error", result.error.issues[0].message);

  const { error } = await user.supabase
    .from("profiles")
    .update({
      first_name: result.data.firstName,
      last_name: result.data.lastName,
      phone: result.data.phone || null,
    })
    .eq("id", user.userId);

  if (error) dashboardRedirect("profile", "error", "Your profile could not be saved.");

  await recordAudit(user.supabase, user.userId, "profile.updated", "profile", user.userId);
  revalidatePath("/dashboard", "layout");
  dashboardRedirect("profile", "message", "Profile saved.");
}

const dependentSchema = z.object({
  firstName: z.string().min(1, "Enter the golfer’s first name."),
  lastName: z.string().min(1, "Enter the golfer’s surname."),
  dateOfBirth: z.string().optional(),
  notes: z.string().max(500, "Keep notes under 500 characters."),
});

export async function addDependent(formData: FormData) {
  const user = await requireDashboardUser();
  const result = dependentSchema.safeParse({
    firstName: text(formData, "firstName"),
    lastName: text(formData, "lastName"),
    dateOfBirth: text(formData, "dateOfBirth") || undefined,
    notes: text(formData, "notes"),
  });

  if (!result.success) dashboardRedirect("family", "error", result.error.issues[0].message);

  const { data, error } = await user.supabase
    .from("dependents")
    .insert({
      client_id: user.userId,
      first_name: result.data.firstName,
      last_name: result.data.lastName,
      date_of_birth: result.data.dateOfBirth || null,
      notes: result.data.notes || null,
    })
    .select("id")
    .single();

  if (error) dashboardRedirect("family", "error", "The family member could not be added.");

  await recordAudit(user.supabase, user.userId, "dependent.created", "dependent", data.id);
  revalidatePath("/dashboard/family");
  dashboardRedirect("family", "message", "Family member added.");
}

export async function removeDependent(formData: FormData) {
  const user = await requireDashboardUser();
  const dependentId = text(formData, "dependentId");
  if (!z.string().uuid().safeParse(dependentId).success) {
    dashboardRedirect("family", "error", "Invalid family member.");
  }

  const { error } = await user.supabase
    .from("dependents")
    .delete()
    .eq("id", dependentId)
    .eq("client_id", user.userId);

  if (error) dashboardRedirect("family", "error", "The family member could not be removed.");

  await recordAudit(user.supabase, user.userId, "dependent.removed", "dependent", dependentId);
  revalidatePath("/dashboard/family");
  dashboardRedirect("family", "message", "Family member removed.");
}

const bookingSchema = z.object({
  serviceId: z.string().uuid("Choose a service."),
  locationId: z.string().uuid("Choose a location."),
  coachId: z.string().uuid().optional(),
  dependentId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time."),
  notes: z.string().max(500, "Keep notes under 500 characters."),
});

export async function createBooking(formData: FormData) {
  const user = await requireDashboardUser();
  const result = bookingSchema.safeParse({
    serviceId: text(formData, "serviceId"),
    locationId: text(formData, "locationId"),
    coachId: text(formData, "coachId") || undefined,
    dependentId: text(formData, "dependentId") || undefined,
    date: text(formData, "date"),
    time: text(formData, "time"),
    notes: text(formData, "notes"),
  });

  if (!result.success) dashboardRedirect("bookings", "error", result.error.issues[0].message);

  const startsAt = new Date(`${result.data.date}T${result.data.time}:00+02:00`);
  if (Number.isNaN(startsAt.valueOf()) || startsAt <= new Date()) {
    dashboardRedirect("bookings", "error", "Choose a future date and time.");
  }

  const { data: service } = await user.supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", result.data.serviceId)
    .eq("is_active", true)
    .maybeSingle();

  if (!service) dashboardRedirect("bookings", "error", "That service is not available.");

  if (result.data.coachId) {
    const { data: coachRole } = await user.supabase
      .from("user_roles")
      .select("user_id")
      .eq("user_id", result.data.coachId)
      .eq("role", "coach")
      .maybeSingle();
    if (!coachRole) dashboardRedirect("bookings", "error", "Choose an available coach.");
  }

  if (result.data.dependentId) {
    const { data: dependent } = await user.supabase
      .from("dependents")
      .select("id")
      .eq("id", result.data.dependentId)
      .eq("client_id", user.userId)
      .maybeSingle();
    if (!dependent) dashboardRedirect("bookings", "error", "Choose a valid family member.");
  }

  const endsAt = new Date(startsAt.valueOf() + service.duration_minutes * 60_000);

  if (result.data.coachId) {
    const { data: slotAvailable, error: slotError } = await user.supabase.rpc(
      "is_coach_slot_available",
      {
        target_coach: result.data.coachId,
        target_location: result.data.locationId,
        target_start: startsAt.toISOString(),
        target_end: endsAt.toISOString(),
        ignored_booking: null,
      },
    );
    if (slotError || !slotAvailable) {
      dashboardRedirect("bookings", "error", "That coach is not available at the selected time.");
    }
  }

  const { data, error } = await user.supabase
    .from("bookings")
    .insert({
      client_id: user.userId,
      dependent_id: result.data.dependentId || null,
      coach_id: result.data.coachId || null,
      service_id: result.data.serviceId,
      location_id: result.data.locationId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      client_notes: result.data.notes || null,
      created_by: user.userId,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    const message = error.code === "23505"
      ? "That coach already has a booking at this time."
      : "The booking request could not be created.";
    dashboardRedirect("bookings", "error", message);
  }

  await recordAudit(user.supabase, user.userId, "booking.created", "booking", data.id);
  revalidatePath("/dashboard/bookings");
  dashboardRedirect("bookings", "message", "Booking request sent.");
}

export async function cancelBooking(formData: FormData) {
  const user = await requireDashboardUser();
  const bookingId = text(formData, "bookingId");
  if (!z.string().uuid().safeParse(bookingId).success) {
    dashboardRedirect("bookings", "error", "Invalid booking.");
  }

  const { error } = await user.supabase.rpc("cancel_own_booking", { target_booking: bookingId });
  if (error) dashboardRedirect("bookings", "error", "This booking cannot be cancelled online.");

  await recordAudit(user.supabase, user.userId, "booking.cancelled", "booking", bookingId);
  revalidatePath("/dashboard/bookings");
  dashboardRedirect("bookings", "message", "Booking cancelled.");
}

export async function addAvailability(formData: FormData) {
  const user = await requireDashboardUser();
  if (user.role !== "coach" && user.role !== "admin") {
    dashboardRedirect("", "error", "You do not have access to availability settings.");
  }

  const weekday = Number(text(formData, "weekday"));
  const locationId = text(formData, "locationId");
  const startTime = text(formData, "startTime");
  const endTime = text(formData, "endTime");

  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !z.string().uuid().safeParse(locationId).success || !startTime || !endTime || startTime >= endTime) {
    dashboardRedirect("availability", "error", "Enter a valid day and time range.");
  }

  const { data, error } = await user.supabase
    .from("coach_availability")
    .insert({
      coach_id: user.userId,
      location_id: locationId,
      weekday,
      start_time: startTime,
      end_time: endTime,
    })
    .select("id")
    .single();

  if (error) dashboardRedirect("availability", "error", "That availability block could not be saved.");

  await recordAudit(user.supabase, user.userId, "availability.created", "availability", data.id);
  revalidatePath("/dashboard/availability");
  dashboardRedirect("availability", "message", "Availability saved.");
}

export async function removeAvailability(formData: FormData) {
  const user = await requireDashboardUser();
  const availabilityId = text(formData, "availabilityId");
  const { error } = await user.supabase
    .from("coach_availability")
    .delete()
    .eq("id", availabilityId)
    .eq("coach_id", user.userId);

  if (error) dashboardRedirect("availability", "error", "Availability could not be removed.");
  revalidatePath("/dashboard/availability");
  dashboardRedirect("availability", "message", "Availability removed.");
}

export async function addAvailabilityException(formData: FormData) {
  const user = await requireDashboardUser();
  if (user.role !== "coach" && user.role !== "admin") {
    dashboardRedirect("", "error", "You do not have access to availability settings.");
  }

  const date = text(formData, "date");
  const mode = text(formData, "exceptionMode");
  const startTime = text(formData, "startTime");
  const endTime = text(formData, "endTime");
  const note = text(formData, "note");
  const available = mode === "available";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !["blocked", "available"].includes(mode)) {
    dashboardRedirect("availability", "error", "Choose a valid date change.");
  }
  if (available && (!startTime || !endTime || startTime >= endTime)) {
    dashboardRedirect("availability", "error", "Enter valid extra working hours.");
  }

  const { data, error } = await user.supabase
    .from("availability_exceptions")
    .insert({
      coach_id: user.userId,
      exception_date: date,
      is_available: available,
      start_time: available ? startTime : null,
      end_time: available ? endTime : null,
      note: note || null,
    })
    .select("id")
    .single();

  if (error) dashboardRedirect("availability", "error", "The date change could not be saved.");

  await recordAudit(user.supabase, user.userId, "availability.exception_created", "availability_exception", data.id);
  revalidatePath("/dashboard/availability");
  dashboardRedirect("availability", "message", "Date change saved.");
}

export async function removeAvailabilityException(formData: FormData) {
  const user = await requireDashboardUser();
  const exceptionId = text(formData, "exceptionId");
  const { error } = await user.supabase
    .from("availability_exceptions")
    .delete()
    .eq("id", exceptionId)
    .eq("coach_id", user.userId);

  if (error) dashboardRedirect("availability", "error", "The date change could not be removed.");
  revalidatePath("/dashboard/availability");
  dashboardRedirect("availability", "message", "Date change removed.");
}

export async function assignBookingCoach(formData: FormData) {
  const user = await requireDashboardUser();
  if (!["admin", "receptionist"].includes(user.role)) {
    dashboardRedirect("bookings", "error", "Operations access is required.");
  }
  const bookingId = text(formData, "bookingId");
  const coachId = text(formData, "coachId");
  if (!z.string().uuid().safeParse(bookingId).success || !z.string().uuid().safeParse(coachId).success) {
    dashboardRedirect("bookings", "error", "Choose a valid coach.");
  }

  const { error } = await user.supabase.rpc("assign_booking_coach", {
    target_booking: bookingId,
    target_coach: coachId,
  });
  if (error) dashboardRedirect("bookings", "error", "That coach is unavailable for this booking.");

  await recordAudit(user.supabase, user.userId, "booking.coach_assigned", "booking", bookingId, { coachId });
  revalidatePath("/dashboard/bookings");
  dashboardRedirect("bookings", "message", "Coach assigned.");
}

export async function updateBookingStatus(formData: FormData) {
  const user = await requireDashboardUser();
  const bookingId = text(formData, "bookingId");
  const status = text(formData, "status");
  const validStatus = z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]).safeParse(status);

  if (!z.string().uuid().safeParse(bookingId).success || !validStatus.success) {
    dashboardRedirect(user.role === "coach" ? "schedule" : "bookings", "error", "Invalid booking update.");
  }

  const { error } = await user.supabase.rpc("set_booking_status", {
    target_booking: bookingId,
    next_status: validStatus.data,
  });

  const section = user.role === "coach" ? "schedule" : "bookings";
  if (error) dashboardRedirect(section, "error", "The booking status could not be updated.");

  await recordAudit(user.supabase, user.userId, "booking.status_updated", "booking", bookingId, { status });
  revalidatePath(`/dashboard/${section}`);
  dashboardRedirect(section, "message", "Booking status updated.");
}

export async function setUserRole(formData: FormData) {
  const user = await requireDashboardUser();
  if (user.role !== "admin") dashboardRedirect("people", "error", "Admin access is required.");

  const targetUserId = text(formData, "userId");
  const roleResult = z.enum(["client", "coach", "receptionist", "admin"]).safeParse(text(formData, "role"));
  const mode = text(formData, "mode");
  if (!z.string().uuid().safeParse(targetUserId).success || !roleResult.success || !["add", "remove"].includes(mode)) {
    dashboardRedirect("people", "error", "Invalid role update.");
  }
  if (targetUserId === user.userId && roleResult.data === "admin" && mode === "remove") {
    dashboardRedirect("people", "error", "You cannot remove your own admin access.");
  }

  const query = mode === "add"
    ? user.supabase.from("user_roles").upsert({ user_id: targetUserId, role: roleResult.data })
    : user.supabase.from("user_roles").delete().eq("user_id", targetUserId).eq("role", roleResult.data);
  const { error } = await query;
  if (error) dashboardRedirect("people", "error", "The role could not be updated.");

  await recordAudit(user.supabase, user.userId, `role.${mode === "add" ? "added" : "removed"}`, "profile", targetUserId, { role: roleResult.data });
  revalidatePath("/dashboard/people");
  dashboardRedirect("people", "message", "Role updated.");
}

export async function updateService(formData: FormData) {
  const user = await requireDashboardUser();
  if (!["admin", "receptionist"].includes(user.role)) {
    dashboardRedirect("services", "error", "Operations access is required.");
  }

  const serviceId = text(formData, "serviceId");
  const name = text(formData, "name");
  const duration = Number(text(formData, "duration"));
  const price = Number(text(formData, "price"));
  const active = formData.get("active") === "on";
  if (!z.string().uuid().safeParse(serviceId).success || !name || !Number.isInteger(duration) || duration < 15 || !Number.isFinite(price) || price < 0) {
    dashboardRedirect("services", "error", "Enter valid service details.");
  }

  const { error } = await user.supabase
    .from("services")
    .update({ name, duration_minutes: duration, price_cents: Math.round(price * 100), is_active: active })
    .eq("id", serviceId);
  if (error) dashboardRedirect("services", "error", "The service could not be saved.");

  await recordAudit(user.supabase, user.userId, "service.updated", "service", serviceId);
  revalidatePath("/dashboard/services");
  dashboardRedirect("services", "message", "Service saved.");
}
