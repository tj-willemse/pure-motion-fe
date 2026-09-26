const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  "https://puremotiongolf.com";

export const siteUrl = (
  configuredSiteUrl.startsWith("http")
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`
).replace(/\/$/, "");

export const site = {
  name: "Pure Motion Golf Academy",
  shortName: "Pure Motion Golf",
  description:
    "Personal golf coaching for juniors, beginners and experienced players in Cape Town.",
  locale: "en_ZA",
  language: "en-ZA",
  locations: [
    {
      name: "Durbanville Golf Club",
      shortName: "Durbanville",
      region: "Northern Suburbs, Cape Town",
    },
    {
      name: "Hazendal Golf, Stellenbosch",
      shortName: "Hazendal",
      region: "Stellenbosch",
    },
  ],
} as const;

type NavChild = {
  label: string;
  href: string;
  image?: string;
  art?: string;
  tone?: "dark";
  detail?: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
};

export const navItems: readonly NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Coaching",
    href: "/coaching",
    children: [
      { label: "Private lessons", href: "/coaching#private-lessons", art: "target" },
      { label: "Lesson packages", href: "/coaching#packages", art: "layers" },
      { label: "Ladies golf", href: "/coaching#ladies-golf", art: "users" },
      { label: "Technology and fittings", href: "/coaching#technology", art: "scan" },
    ],
  },
  {
    label: "Juniors",
    href: "/juniors",
    children: [
      { label: "Free assessment", href: "/juniors#assessment", art: "check" },
      { label: "Junior Academy", href: "/juniors#academy", art: "graduation" },
      { label: "Order of Merit", href: "/juniors#order-of-merit", art: "trophy", tone: "dark" },
      { label: "Holiday programmes", href: "/juniors#holiday-programmes", art: "sun" },
      { label: "School Team Golf", href: "/juniors#school-team-golf", art: "users" },
      { label: "Calendar", href: "/juniors#calendar", art: "calendar" },
      { label: "Academy fees & terms", href: "/juniors/academy-terms", art: "check" },
      { label: "Academy registration", href: "/juniors/academy-registration", art: "calendar" },
    ],
  },
  {
    label: "Team",
    href: "/coaches",
    children: [
      { label: "Lana Orgovanyi", detail: "Director of Golf and Founder", href: "/coaches#lana", image: "/images/coaches/lana-orgovanyi.webp" },
      { label: "Chanrie Losper", detail: "Teaching Professional", href: "/coaches#chanrie", image: "/images/coaches/chanrie-losper.webp" },
      { label: "Christiaan Basson", detail: "PGA Associate Coach", href: "/coaches#christiaan", image: "/images/coaches/christiaan-basson.webp" },
      { label: "Leandri van Rooyen", detail: "AA PGA Professional", href: "/coaches#leandri", image: "/images/coaches/leandri-van-rooyen.webp" },
      { label: "Ludwig Coetzer", detail: "Apprentice Coach", href: "/coaches#ludwig", image: "/images/coaches/ludwig-coetzer.webp" },
      { label: "Luzelle Booyens", detail: "AA PGA Professional", href: "/coaches#luzelle", image: "/images/coaches/luzelle-booyens.webp" },
      { label: "Matthew Kilfoil", detail: "PGA Teaching Professional", href: "/coaches#matthew", image: "/images/coaches/matthew-kilfoil.webp" },
      { label: "M.S. Calitz", detail: "PGA Teaching Professional", href: "/coaches#ms-calitz", image: "/images/coaches/ms-calitz.webp" },
    ],
  },
  {
    label: "Contact & Events",
    href: "/events",
    children: [
      { label: "Contact", href: "/events#contact", art: "message" },
      { label: "Current events", href: "/events#upcoming", art: "megaphone" },
      { label: "AIM Series", href: "/events#aim-series", art: "target" },
      { label: "Academy calendar", href: "/events#calendar", art: "calendar" },
      { label: "Fixtures and results", href: "/events#results", art: "trophy" },
      { label: "Feedback", href: "/events#feedback", art: "star" },
    ],
  },
  {
    label: "Driving Range",
    href: "/driving-range",
    children: [
      { label: "Facilities", href: "/driving-range#facilities", art: "flag" },
      { label: "Bucket prices", href: "/driving-range#bucket-prices", art: "coins" },
      { label: "Package deals", href: "/driving-range#packages", art: "badge" },
      { label: "How it works", href: "/driving-range#how-it-works", art: "fingerprint" },
      { label: "Add a package user", href: "/driving-range#sharing", art: "userplus" },
    ],
  },
];

export const coaches = [
  {
    id: "lana",
    name: "Lana Orgovanyi",
    role: "Director of Golf and Founder",
    location: "Durbanville and Hazendal",
    availability: "Currently at capacity",
    image: "/images/coaches/lana-orgovanyi.webp",
    bio: "After a successful amateur and professional career in Europe, Lana moved into coaching more than 20 years ago. She leads the academy and its coaching standards across both locations.",
    acceptingBookings: false,
  },
  {
    id: "chanrie",
    name: "Chanrie Losper",
    role: "Teaching Professional",
    location: "Hazendal",
    availability: "Monday to Saturday, weekday afternoons",
    image: "/images/coaches/chanrie-losper.webp",
    bio: "Chanrie creates a positive coaching environment for juniors and women. Her focus is building confidence, overcoming challenges and making improvement enjoyable.",
    acceptingBookings: true,
  },
  {
    id: "christiaan",
    name: "Christiaan Basson",
    role: "PGA Associate Coach",
    location: "Durbanville",
    availability: "Monday to Saturday",
    image: "/images/coaches/christiaan-basson.webp",
    bio: "A former South African Eisenhower Trophy player and three time Sunshine Tour winner, Christiaan brings 19 consecutive tour seasons and deep competitive experience to every lesson.",
    acceptingBookings: true,
  },
  {
    id: "leandri",
    name: "Leandri van Rooyen",
    role: "AA PGA Professional",
    location: "Durbanville",
    availability: "Tuesday to Sunday",
    image: "/images/coaches/leandri-van-rooyen.webp",
    bio: "A PGA professional since 2014 with experience in coaching, retail and national and international long drive competition. Leandri helps every player build skill and enjoyment.",
    acceptingBookings: true,
  },
  {
    id: "ludwig",
    name: "Ludwig Coetzer",
    role: "Apprentice Coach",
    location: "Durbanville",
    availability: "Thursday to Tuesday",
    image: "/images/coaches/ludwig-coetzer.webp",
    bio: "Ludwig brings experience from junior golf, the SA Golf Institute and professional caddying on the DP World Tour and Sunshine Tour. He is completing his PGA qualification.",
    acceptingBookings: true,
  },
  {
    id: "luzelle",
    name: "Luzelle Booyens",
    role: "AA PGA Professional",
    location: "Durbanville",
    availability: "Monday to Saturday",
    image: "/images/coaches/luzelle-booyens.webp",
    bio: "Luzelle qualified with the PGA in 2020 and reached AA class in 2025. She enjoys helping experienced players and young golfers build confidence and exceed their goals.",
    acceptingBookings: true,
  },
  {
    id: "matthew",
    name: "Matthew Kilfoil",
    role: "PGA Teaching Professional",
    location: "Durbanville",
    availability: "Tuesday to Sunday",
    image: "/images/coaches/matthew-kilfoil.webp",
    bio: "A Pure Motion coach since 2017, Matthew has helped players of all ages progress, including junior provincial golfers. His coaching is patient, considered and encouraging.",
    acceptingBookings: true,
  },
  {
    id: "ms-calitz",
    name: "M.S. Calitz",
    role: "PGA Teaching Professional",
    location: "Hazendal",
    availability: "Monday to Saturday",
    image: "/images/coaches/ms-calitz.webp",
    bio: "M.S. combines Sunshine Tour experience with seven years of coaching. He works with players of every age and is known for clear communication and patience.",
    acceptingBookings: true,
  },
] as const;

export const services = [
  {
    id: "junior-assessment",
    title: "Free junior assessment",
    shortTitle: "Junior assessment",
    duration: "Assessment",
    price: 0,
    description: "A complimentary assessment to find the right junior programme.",
  },
  {
    id: "private-30",
    title: "30 minute private lesson",
    shortTitle: "Private lesson",
    duration: "30 min",
    price: 382,
    description: "Focused individual coaching for a clear next step.",
  },
  {
    id: "private-55",
    title: "55 minute private lesson",
    shortTitle: "Extended lesson",
    duration: "55 min",
    price: 679,
    description: "More time for deeper technical work and practice.",
  },
  {
    id: "junior-30",
    title: "30 minute junior lesson",
    shortTitle: "Junior lesson",
    duration: "30 min",
    price: 307,
    description: "Individual coaching shaped around the junior golfer.",
  },
  {
    id: "on-course",
    title: "On course lesson",
    shortTitle: "On course lesson",
    duration: "2 hours",
    price: 1708,
    description: "Strategy, smart decisions and performance on the course.",
  },
] as const;

export function formatRand(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
