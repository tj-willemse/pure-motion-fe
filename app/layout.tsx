import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AppToaster } from "@/components/app-toaster";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pure Motion Golf Academy | Golf Coaching in Cape Town",
    template: "%s | Pure Motion Golf",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "golf lessons Cape Town",
    "golf coach Durbanville",
    "golf coaching Stellenbosch",
    "junior golf academy",
    "Pure Motion Golf",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: siteUrl,
    siteName: site.name,
    title: "Pure Motion Golf Academy | Golf Coaching in Cape Town",
    description: site.description,
    images: [
      {
        url: "/images/home/hero-course.webp",
        width: 2560,
        height: 930,
        alt: "Golf ball on a sunlit green",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pure Motion Golf Academy",
    description: site.description,
    images: ["/images/home/hero-course.webp"],
  },
  icons: {
    icon: "/brand/pm-logo.svg",
    apple: "/brand/pm-logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f3ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.language} data-scroll-behavior="smooth">
      <body className={dmSans.variable}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <AppToaster />
      </body>
    </html>
  );
}
