"use server";

import { createYocoCheckout } from "@/lib/yoco";

export async function startPayment(token: string): Promise<{ url?: string; error?: string }> {
  try { return { url: await createYocoCheckout(token) }; }
  catch (error) { return { error: error instanceof Error ? error.message : "Checkout is unavailable. Please retry." }; }
}
