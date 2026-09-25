import { redirect } from "next/navigation";

type PortalPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const { error, message } = await searchParams;
  const params = new URLSearchParams();
  if (error) params.set("error", error);
  if (message) params.set("message", message);
  redirect(`/login${params.size ? `?${params.toString()}` : ""}`);
}
