// Only permit local application paths, including query strings and section anchors.
export function safeNext(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\s\x00-\x1f]/.test(value)) return "/dashboard";
  try {
    const url = new URL(value, "https://local.invalid");
    return url.origin === "https://local.invalid" && !url.pathname.startsWith("/auth/") ? value : "/dashboard";
  } catch { return "/dashboard"; }
}
