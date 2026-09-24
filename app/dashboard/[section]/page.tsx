import { DashboardPage } from "@/app/dashboard/dashboard-page";

type PageProps = {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function DashboardSectionPage({ params, searchParams }: PageProps) {
  const [{ section }, query] = await Promise.all([params, searchParams]);
  return <DashboardPage section={section} error={query.error} message={query.message} />;
}
