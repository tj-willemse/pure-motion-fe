import { z } from "zod";
import { revalidatePath } from "next/cache";
import { verifyYocoWebhook } from "@/lib/yoco-security";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const eventSchema = z.object({
  id: z.string().min(1), type: z.enum(["payment.succeeded", "payment.failed"]),
  payload: z.object({
    id: z.string().min(1), amount: z.number().int().positive(), currency: z.literal("ZAR"),
    mode: z.enum(["test", "live"]), status: z.enum(["succeeded", "failed"]),
    metadata: z.object({ checkoutId: z.string().min(1) }),
  }),
});

export async function POST(request: Request) {
  const secret = process.env.YOCO_WEBHOOK_SECRET;
  const admin = createAdminClient();
  if (!secret || !admin) return new Response("Webhook not configured", { status: 503 });
  const body = await request.text();
  if (body.length > 65536) return new Response("Payload too large", { status: 413 });
  if (!verifyYocoWebhook(body, request.headers, secret)) return new Response("Invalid signature", { status: 401 });
  let raw;
  try { raw = JSON.parse(body); } catch { return new Response("Invalid JSON", { status: 400 }); }
  if (raw.type !== "payment.succeeded" && raw.type !== "payment.failed") return new Response("Ignored", { status: 200 });
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success || parsed.data.type !== `payment.${parsed.data.payload.status}`) return new Response("Invalid payment event", { status: 400 });
  const { data, error } = await admin.rpc("apply_oom_yoco_event", { event: parsed.data });
  if (error) return new Response("Payment reconciliation failed", { status: 500 });
  revalidatePath("/dashboard/order-of-merit");
  return Response.json({ received: true, result: data });
}
