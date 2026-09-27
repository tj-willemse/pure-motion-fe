export type OomDivisionId = "standard" | "kickstarter";
export type OomRoundStatus = "draft" | "open" | "full" | "closed" | "cancelled" | "completed";
export type OomRegistrationStatus = "capacity_hold" | "payment_pending" | "confirmed" | "cancelled";
export type OomPaymentStatus = "not_started" | "pending" | "paid" | "expired" | "refunded";

export type OomDivision = {
  id: OomDivisionId;
  name: string;
  shortName: string;
  format: string;
  summary: string;
  rules: readonly string[];
};

export type OomRound = {
  id: string;
  term: 1 | 2 | 3 | 4;
  date: string;
  nine: "Front nine" | "Back nine";
  status: OomRoundStatus;
  registrationOpens: string;
  registrationCloses: string;
  capacity: Record<OomDivisionId, number>;
  confirmed: Record<OomDivisionId, number>;
  note?: string;
};

export type OomLeaderboardRow = {
  position: number;
  player: string;
  rounds: number;
  frontNine: number;
  backNine: number;
  score: number;
};

export type OomRegistration = {
  id: string;
  player: string;
  parent: string;
  division: OomDivisionId;
  roundIds: readonly string[];
  jamMember: boolean;
  amountCents: number;
  status: OomRegistrationStatus;
  paymentStatus: OomPaymentStatus;
  paymentDeadline: string;
};

export const oomSeason = {
  id: "oom-2026",
  year: 2026,
  name: "2026 Order of Merit",
  venue: "Durbanville Golf Club",
  address: "Sport Way, Durbanville, Western Cape",
  checkIn: "15:00–15:15",
  firstTeeTime: "From approximately 15:20",
  ageRange: "6–18 years old on 1 January 2026",
  standardPriceCents: 8000,
  jamPriceCents: 3500,
  termDiscountPercent: 10,
  minimumPrizeRounds: 12,
  requiredFrontNineRounds: 6,
  requiredBackNineRounds: 6,
  publicationStatus: "published" as const,
};

export const oomRegistrationOptions = {
  relationships: ["Parent", "Legal guardian", "Grandparent", "Adult player", "Other responsible adult"],
  discoverySources: [
    "Internet Search",
    "Email from Pure Motion",
    "Durbanville Golf Club",
    "Hazendal Golf, Stellenbosch",
    "Instagram",
    "Facebook",
    "From friends/family",
    "From a coach at Pure Motion",
    "Brochure",
    "Other",
  ],
  genders: ["Girl", "Boy"],
  grades: ["Pre-school", "Grade R", ...Array.from({ length: 12 }, (_, index) => `Grade ${index + 1}`), "Post-school"],
  coaches: [
    "Christiaan Basson",
    "Chanrie Losper",
    "Leandri van Rooyen",
    "Ludwig Coetzer",
    "Luzelle Booyens",
    "Matthew Kilfoil",
    "M.S. Calitz",
  ],
} as const;

export const oomDivisions: readonly OomDivision[] = [
  {
    id: "standard",
    name: "Standard / Stableford",
    shortName: "Standard",
    format: "Nine-hole Stableford",
    summary:
      "For juniors ready for a standard-length nine-hole course and the routines of Stableford competition.",
    rules: [
      "Boys aged 13 and older play from the blue tees.",
      "Boys aged 12 and younger and all girls play from the red tees.",
      "Players without an official handicap begin with an allocated Handicap Index of 36.0.",
      "Fairways hit, greens in regulation and putts must be recorded.",
    ],
  },
  {
    id: "kickstarter",
    name: "Kickstarter",
    shortName: "Kickstarter",
    format: "Adapted nine-hole gross score",
    summary:
      "A shorter adapted course for developing players who are ready to learn competition on the course.",
    rules: [
      "No official Handicap Index is required.",
      "The maximum score is seven on each hole.",
      "After six strokes without holing out, record seven and continue to the next hole.",
      "Putts must be recorded on every hole.",
    ],
  },
] as const;

const round = (
  id: string,
  term: 1 | 2 | 3 | 4,
  date: string,
  nine: "Front nine" | "Back nine",
  status: OomRoundStatus = "completed",
  confirmed: Record<OomDivisionId, number> = { standard: 21, kickstarter: 8 },
  note?: string,
): OomRound => {
  const eventDate = new Date(`${date}T12:00:00+02:00`);
  const opens = new Date(eventDate);
  opens.setDate(eventDate.getDate() - 6);
  const closes = new Date(eventDate);
  closes.setDate(eventDate.getDate() - 3);

  return {
    id,
    term,
    date,
    nine,
    status,
    registrationOpens: opens.toISOString(),
    registrationCloses: closes.toISOString(),
    capacity: { standard: 32, kickstarter: 16 },
    confirmed,
    note,
  };
};

export const oomRounds: readonly OomRound[] = [
  round("oom-2026-01", 1, "2026-01-27", "Front nine"),
  round("oom-2026-02", 1, "2026-02-03", "Back nine"),
  round("oom-2026-03", 1, "2026-02-10", "Front nine"),
  round("oom-2026-04", 1, "2026-02-17", "Back nine"),
  round("oom-2026-05", 1, "2026-02-24", "Front nine"),
  round("oom-2026-06", 1, "2026-03-10", "Back nine"),
  round("oom-2026-07", 1, "2026-03-17", "Front nine"),
  round("oom-2026-08", 1, "2026-03-24", "Back nine"),
  round("oom-2026-09", 2, "2026-04-14", "Front nine"),
  round("oom-2026-10", 2, "2026-04-28", "Back nine"),
  round("oom-2026-11", 2, "2026-05-05", "Front nine"),
  round("oom-2026-12", 2, "2026-05-12", "Back nine", "cancelled", { standard: 0, kickstarter: 0 }, "Cancelled by the academy"),
  round("oom-2026-13", 2, "2026-05-19", "Front nine"),
  round("oom-2026-14", 2, "2026-05-26", "Back nine"),
  round("oom-2026-15", 2, "2026-06-02", "Front nine"),
  round("oom-2026-16", 2, "2026-06-09", "Back nine"),
  round("oom-2026-17", 2, "2026-06-23", "Front nine"),
  round("oom-2026-18", 3, "2026-07-28", "Back nine"),
  round("oom-2026-19", 3, "2026-08-04", "Front nine"),
  round("oom-2026-20", 3, "2026-08-11", "Back nine"),
  round("oom-2026-21", 3, "2026-08-18", "Front nine"),
  round("oom-2026-22", 3, "2026-08-25", "Back nine"),
  round("oom-2026-23", 3, "2026-09-08", "Front nine"),
  round("oom-2026-24", 3, "2026-09-15", "Back nine"),
  round("oom-2026-25", 3, "2026-09-22", "Front nine", "cancelled", { standard: 0, kickstarter: 0 }, "Cancelled by the academy"),
  round("oom-2026-26", 4, "2026-10-13", "Back nine", "full", { standard: 32, kickstarter: 16 }, "Fully booked"),
  round("oom-2026-27", 4, "2026-10-20", "Front nine", "full", { standard: 32, kickstarter: 16 }, "Fully booked"),
  round("oom-2026-28", 4, "2026-10-27", "Back nine", "full", { standard: 32, kickstarter: 16 }, "Fully booked"),
  round("oom-2026-29", 4, "2026-11-03", "Front nine", "full", { standard: 32, kickstarter: 16 }, "Fully booked"),
  round("oom-2026-30", 4, "2026-11-10", "Back nine", "full", { standard: 32, kickstarter: 16 }, "Fully booked"),
  round("oom-2026-31", 4, "2026-11-17", "Front nine", "full", { standard: 32, kickstarter: 16 }, "Fully booked"),
  round("oom-2026-32", 4, "2026-11-24", "Back nine", "open", { standard: 0, kickstarter: 0 }, "Registration available"),
  round("oom-2026-33", 4, "2026-12-01", "Front nine", "open", { standard: 0, kickstarter: 16 }, "Stableford only; Kickstarter fully booked"),
] as const;

export const standardPoints = [
  { place: "1st", points: 60 },
  { place: "2nd", points: 52 },
  { place: "3rd", points: 45 },
  { place: "4th", points: 38 },
  { place: "5th", points: 30 },
  { place: "6th", points: 25 },
  { place: "7th", points: 20 },
  { place: "8th", points: 15 },
  { place: "9th onward", points: 10 },
] as const;

export const oomLeaderboards: Record<OomDivisionId, readonly OomLeaderboardRow[]> = {
  standard: [
    { position: 1, player: "Ethan Williams", rounds: 17, frontNine: 9, backNine: 8, score: 742 },
    { position: 2, player: "Mila Naidoo", rounds: 16, frontNine: 8, backNine: 8, score: 701 },
    { position: 3, player: "Daniel Jacobs", rounds: 15, frontNine: 8, backNine: 7, score: 655 },
    { position: 4, player: "Liam Petersen", rounds: 14, frontNine: 7, backNine: 7, score: 610 },
    { position: 5, player: "Ava Smith", rounds: 13, frontNine: 7, backNine: 6, score: 566 },
  ],
  kickstarter: [
    { position: 1, player: "Mia Petersen", rounds: 14, frontNine: 7, backNine: 7, score: 49.4 },
    { position: 2, player: "Noah Daniels", rounds: 13, frontNine: 7, backNine: 6, score: 51.1 },
    { position: 3, player: "Zoe Adams", rounds: 12, frontNine: 6, backNine: 6, score: 52.8 },
    { position: 4, player: "Leo Williams", rounds: 11, frontNine: 6, backNine: 5, score: 54.2 },
  ],
};

export const oomRegistrations: readonly OomRegistration[] = [
  { id: "REG-2618", player: "Daniel Jacobs", parent: "Sarah Jacobs", division: "standard", roundIds: ["oom-2026-26", "oom-2026-27"], jamMember: true, amountCents: 7000, status: "confirmed", paymentStatus: "paid", paymentDeadline: "2026-10-08T18:00:00+02:00" },
  { id: "REG-2619", player: "Mia Petersen", parent: "James Petersen", division: "kickstarter", roundIds: ["oom-2026-26"], jamMember: false, amountCents: 8000, status: "payment_pending", paymentStatus: "pending", paymentDeadline: "2026-10-08T20:00:00+02:00" },
  { id: "REG-2620", player: "Ava Smith", parent: "Lauren Smith", division: "standard", roundIds: ["oom-2026-27", "oom-2026-28", "oom-2026-29"], jamMember: true, amountCents: 10500, status: "confirmed", paymentStatus: "paid", paymentDeadline: "2026-10-09T10:00:00+02:00" },
  { id: "REG-2621", player: "Noah Daniels", parent: "Kim Daniels", division: "kickstarter", roundIds: ["oom-2026-27"], jamMember: true, amountCents: 3500, status: "capacity_hold", paymentStatus: "not_started", paymentDeadline: "2026-10-09T12:00:00+02:00" },
];

export const oomTermsSections = [
  {
    title: "Registration, payment and cancellations",
    paragraphs: [
      "Space is limited and a tee time is confirmed only once payment has been received within the stated payment window.",
      "Participant cancellations and non-attendance do not qualify for a refund, credit or carry-over. When Pure Motion cancels because of weather or course closure, the entry qualifies for a refund or carry-over.",
      "Tee times are emailed on Sunday evening or Monday morning. Cancellations should be sent by email or WhatsApp by Monday end of day.",
    ],
  },
  {
    title: "Arrival, check-in and pace of play",
    paragraphs: [
      "Players must arrive 15–20 minutes before their tee time, check in and collect a scorecard. A player not checked in 15 minutes before the tee time may be treated as a no-show.",
      "Players must keep pace, follow course etiquette and return their scorecards to the scoring table before leaving.",
    ],
  },
  {
    title: "Scoring and scorecards",
    paragraphs: [
      "Players keep their own card and mark a playing partner’s card. Signing for a score lower than the actual hole score causes disqualification; a signed higher score stands.",
      "Standard players record fairways hit, greens in regulation and putts. Kickstarter players record putts on every hole. Missing required statistics removes the player from the annual statistics competition.",
    ],
  },
  {
    title: "Dress code and equipment",
    paragraphs: [
      "Players must wear neat golf attire, a collared or crew-neck shirt, suitable pants or golf shorts and closed sport or golf shoes. T-shirts, jeans, tracksuit pants and sandals are not permitted.",
      "Every golfer must carry a sandbag for repairing divots and bring suitable weather protection.",
    ],
  },
  {
    title: "Adults accompanying juniors",
    paragraphs: [
      "Players aged 6–10 must be accompanied by an adult. Adults may assist younger Kickstarter players with scoring but must not intervene with other juniors or the course of play.",
      "Questions or concerns should be raised with the organisers after the round.",
    ],
  },
  {
    title: "Safety, conduct and participation",
    paragraphs: [
      "Registration acknowledges the ordinary risks of golf and includes acceptance of the competition rules, fee undertaking, waiver and indemnity.",
      "Pure Motion retains right of admission and may end participation following unsafe behaviour, repeated no-shows or serious breaches of conduct.",
    ],
  },
] as const;

export function getOomRoundsByTerm(term: 1 | 2 | 3 | 4) {
  return oomRounds.filter((item) => item.term === term);
}

export function getOomDivision(id: OomDivisionId) {
  return oomDivisions.find((division) => division.id === id) ?? oomDivisions[0];
}

export function formatOomDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(`${value}T12:00:00+02:00`));
}

export function formatRand(cents: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
