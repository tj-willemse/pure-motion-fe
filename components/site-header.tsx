"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Fingerprint,
  Flag,
  GraduationCap,
  Layers3,
  Megaphone,
  Menu,
  MessageCircle,
  ScanLine,
  Star,
  Sun,
  Target,
  Trophy,
  UserPlus,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/site";

const menuIcons: Record<string, LucideIcon> = {
  badge: BadgeCheck,
  calendar: CalendarDays,
  check: CheckCircle2,
  coins: CircleDollarSign,
  fingerprint: Fingerprint,
  flag: Flag,
  graduation: GraduationCap,
  layers: Layers3,
  megaphone: Megaphone,
  message: MessageCircle,
  scan: ScanLine,
  star: Star,
  sun: Sun,
  target: Target,
  trophy: Trophy,
  userplus: UserPlus,
  users: UsersRound,
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [homeSection, setHomeSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const hasImageHero =
    pathname === "/" ||
    pathname === "/coaching" ||
    pathname === "/juniors" ||
    pathname === "/driving-range";

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["juniors", "locations"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        const active = [...visibility.entries()].sort((a, b) => b[1] - a[1])[0];
        setHomeSection(active && active[1] > 0 ? active[0] : null);
      },
      { rootMargin: "-22% 0px -54%", threshold: [0, 0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    let links: HTMLAnchorElement[] = [];
    let sections: HTMLElement[] = [];
    let sectionNav: HTMLElement | null = null;

    const updateSectionProgress = () => {
      if (!sectionNav || links.length === 0) return;

      const stickyTop = Number.parseFloat(window.getComputedStyle(sectionNav).top) || 0;
      const activationLine =
        stickyTop + sectionNav.offsetHeight + Math.min(window.innerHeight * 0.32, 300);
      const activationPosition = window.scrollY + activationLine;
      const sectionTops = sections.map(
        (section) => window.scrollY + section.getBoundingClientRect().top,
      );
      let activeIndex = -1;

      sectionTops.forEach((sectionTop, index) => {
        if (sectionTop <= activationPosition) {
          activeIndex = index;
        }
      });

      links.forEach((link, index) => {
        const sectionStart = sectionTops[index];
        const sectionEnd =
          sectionTops[index + 1] ??
          Math.max(sectionStart + window.innerHeight, document.documentElement.scrollHeight);
        const progress = Math.min(
          1,
          Math.max(0, (activationPosition - sectionStart) / Math.max(1, sectionEnd - sectionStart)),
        );

        link.style.setProperty("--section-progress", progress.toFixed(4));
        link.classList.toggle("section-link-past", index < activeIndex);
        link.classList.toggle("section-link-active", index === activeIndex);
        link.classList.toggle("section-link-future", index > activeIndex || activeIndex === -1);

        if (index === activeIndex) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateSectionProgress);
    };

    frame = window.requestAnimationFrame(() => {
      sectionNav = document.querySelector<HTMLElement>(".section-nav-sticky");
      if (!sectionNav) return;

      links = Array.from(sectionNav.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]'));
      sections = links
        .map((link) => document.getElementById(link.hash.slice(1)))
        .filter((section): section is HTMLElement => Boolean(section));

      updateSectionProgress();
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    let animationFrame = 0;
    let lastScrolled: boolean | null = null;

    const syncScrollState = () => {
      const scrollTop = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      );
      const nextScrolled = scrollTop > 1;

      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled;
        setIsScrolled(nextScrolled);
      }
    };

    const handleScroll = () => {
      syncScrollState();
      setActiveMenu(null);
    };

    const watchScrollPosition = () => {
      syncScrollState();
      animationFrame = window.requestAnimationFrame(watchScrollPosition);
    };

    watchScrollPosition();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, []);

  function isActive(href: string) {
    if (href === "/coaching") return pathname === "/coaching";
    if (href === "/coaches") return pathname === "/coaches" || pathname === "/team";
    if (href.startsWith("/#")) return pathname === "/" && homeSection === href.slice(2);
    return pathname === href;
  }

  return (
    <header
      className={`site-header${hasImageHero ? " header-overlay" : ""}${isScrolled ? " is-scrolled" : ""}${open || activeMenu ? " menu-open" : ""}`}
    >
      <div className="site-shell header-inner">
        <Link href="/" className="brand-link" aria-label="Pure Motion Golf home">
          <Image
            src="/brand/pure-motion-wordmark.webp"
            alt="Pure Motion Golf Academy"
            width={2025}
            height={573}
            className="brand-wordmark"
            priority
          />
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
          onMouseLeave={() => setActiveMenu(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setActiveMenu(null);
              (document.activeElement as HTMLElement | null)?.blur();
            }
          }}
        >
          {navItems.map((item) => (
            <div
              className={`desktop-nav-item${activeMenu === item.href ? " menu-active" : ""}`}
              key={item.href}
              onMouseEnter={() => setActiveMenu(item.children ? item.href : null)}
              onMouseLeave={() => setActiveMenu(null)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setActiveMenu(null);
                }
              }}
            >
              <Link
                href={item.href}
                className={isActive(item.href) ? "active" : undefined}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={(event) => {
                  setActiveMenu(null);
                  event.currentTarget.blur();
                }}
                onFocus={() => {
                  setActiveMenu(item.children ? item.href : null);
                }}
              >
                {item.label}
                {item.children && <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />}
              </Link>
              {item.children && (
                <div className="nav-dropdown">
                  <div
                    className={`nav-dropdown-panel ${item.href === "/coaches" ? "nav-dropdown-panel-team" : ""}`}
                    style={
                      item.href === "/coaches"
                        ? undefined
                        : { gridTemplateColumns: `repeat(${Math.min(item.children.length, 4)}, minmax(0, 1fr))` }
                    }
                  >
                    {item.children.map((child, index) => {
                      const MenuIcon = child.art ? menuIcons[child.art] : null;
                      return (
                        <Link
                          href={child.href}
                          key={child.href}
                          onClick={(event) => {
                            setActiveMenu(null);
                            event.currentTarget.blur();
                          }}
                        >
                          {child.image ? (
                            <span className="nav-dropdown-image">
                              <Image src={child.image} alt="" fill sizes={`${Math.ceil(100 / (item.children?.length ?? 1))}vw`} />
                            </span>
                          ) : (
                            <span
                              className={`nav-dropdown-art ${
                                child.tone === "dark"
                                  ? "nav-dropdown-art-dark"
                                  : `nav-dropdown-art-${(index % 4) + 1}`
                              }`}
                            >
                              {MenuIcon && <MenuIcon size={62} strokeWidth={1.35} aria-hidden="true" />}
                              <i aria-hidden="true" />
                            </span>
                          )}
                          <strong>{child.label}</strong>
                          {child.detail && <span className="nav-dropdown-detail">{child.detail}</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/book" className="button button-small">
            Book a lesson
          </Link>
          <Link href="/login" className="portal-link" aria-label="Sign in to your profile">
            <UserRound size={18} aria-hidden="true" />
          </Link>
          <button
            className="menu-button"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => {
              setOpen((value) => !value);
              if (open) setMobileSection(null);
            }}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="site-shell mobile-nav-inner">
            {navItems.map((item) => (
              <div className="mobile-nav-group" key={item.href}>
                <div className="mobile-nav-parent">
                  <Link
                    href={item.href}
                    className={isActive(item.href) ? "active" : undefined}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => {
                      setOpen(false);
                      setMobileSection(null);
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-label={`${mobileSection === item.href ? "Close" : "Open"} ${item.label} sections`}
                      aria-expanded={mobileSection === item.href}
                      onClick={() => setMobileSection((current) => current === item.href ? null : item.href)}
                    >
                      <ChevronDown size={17} aria-hidden="true" />
                    </button>
                  )}
                </div>
                {item.children && mobileSection === item.href && (
                  <div className="mobile-nav-children">
                    {item.children.map((child) => (
                      <Link
                        href={child.href}
                        key={child.href}
                        onClick={() => {
                          setOpen(false);
                          setMobileSection(null);
                        }}
                      >
                        <span>{child.label}</span>
                        {child.detail && <small>{child.detail}</small>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/book" className="button" onClick={() => setOpen(false)}>
              Book a lesson
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
