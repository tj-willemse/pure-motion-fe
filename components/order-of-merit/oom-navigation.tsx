import Link from "next/link";
import { CalendarDays, ClipboardList, FileText, Trophy } from "lucide-react";

const links = [
  { href: "#overview", label: "Overview", icon: Trophy },
  { href: "#leaderboards", label: "Leaderboards", icon: ClipboardList },
  { href: "#dates", label: "Dates, fees & terms", icon: FileText },
  { href: "#registration", label: "Registration", icon: CalendarDays },
] as const;

export function OomNavigation() {
  return (
    <div className="section-nav-sticky">
      <nav className="site-shell coaching-section-nav oom-section-nav" aria-label="Order of Merit page sections">
        {links.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            <strong>{label}</strong>
          </Link>
        ))}
      </nav>
    </div>
  );
}
