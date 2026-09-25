import { redirect } from "next/navigation";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;
  redirect(`/register${error ? `?error=${encodeURIComponent(error)}` : ""}`);
}
