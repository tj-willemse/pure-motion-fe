export type DashboardRole = "client" | "coach" | "receptionist" | "admin";

export type DashboardNavItem = {
  label: string;
  href: string;
};

const commonProfile: DashboardNavItem = { label: "Profile", href: "/dashboard/profile" };

export const dashboardNavigation: Record<DashboardRole, DashboardNavItem[]> = {
  client: [
    { label: "Overview", href: "/dashboard" },
    { label: "Bookings", href: "/dashboard/bookings" },
    { label: "Family", href: "/dashboard/family" },
    commonProfile,
  ],
  coach: [
    { label: "Overview", href: "/dashboard" },
    { label: "Schedule", href: "/dashboard/schedule" },
    { label: "Availability", href: "/dashboard/availability" },
    { label: "Clients", href: "/dashboard/clients" },
    commonProfile,
  ],
  receptionist: [
    { label: "Overview", href: "/dashboard" },
    { label: "Bookings", href: "/dashboard/bookings" },
    { label: "People", href: "/dashboard/people" },
    { label: "Services", href: "/dashboard/services" },
    commonProfile,
  ],
  admin: [
    { label: "Overview", href: "/dashboard" },
    { label: "Bookings", href: "/dashboard/bookings" },
    { label: "People", href: "/dashboard/people" },
    { label: "Services", href: "/dashboard/services" },
    { label: "Audit log", href: "/dashboard/audit" },
    commonProfile,
  ],
};

export function getPrimaryRole(roles: string[]): DashboardRole {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("receptionist")) return "receptionist";
  if (roles.includes("coach")) return "coach";
  return "client";
}
