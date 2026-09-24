import { DashboardPage } from "@/app/dashboard/dashboard-page";

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function DashboardOverviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <DashboardPage error={params.error} message={params.message} />;
}
