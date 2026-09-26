export type AcademyScheduleRow = readonly [
  day: string,
  sessions: number,
  dates: string,
];

export type AcademySchedule = {
  title: string;
  rate: "opening" | "current";
  note?: string;
  rows: readonly AcademyScheduleRow[];
};

export const academyRates = {
  opening: {
    grassroots: 151.52,
    group: 228.12,
    individual: 244.38,
    family: 293.26,
  },
  current: {
    grassroots: 160.61,
    group: 241.81,
    individual: 259.05,
    family: 310.86,
  },
} as const;

export const academySchedules: readonly AcademySchedule[] = [
  {
    title: "January 2026",
    rate: "opening",
    rows: [
      ["Monday", 2, "19, 26"], ["Tuesday", 2, "20, 27"],
      ["Wednesday", 3, "14, 21, 28"], ["Thursday", 3, "15, 22, 29"],
      ["Friday", 3, "16, 23, 30"], ["Saturday", 3, "17, 24, 31"],
      ["Sunday", 2, "18, 25"],
    ],
  },
  {
    title: "February 2026",
    rate: "opening",
    rows: [
      ["Monday", 3, "9, 16, 23"], ["Tuesday", 4, "3, 10, 17, 24"],
      ["Wednesday", 4, "4, 11, 18, 25"], ["Thursday", 4, "5, 12, 19, 26"],
      ["Friday", 4, "6, 13, 20, 27"], ["Saturday", 4, "7, 14, 21, 28"],
      ["Sunday", 4, "1, 8, 15, 22"],
    ],
  },
  {
    title: "March 2026 — Durbanville",
    rate: "current",
    note: "March 2026 price increase applied.",
    rows: [
      ["Monday", 3, "9, 16, 23"], ["Tuesday", 3, "10, 17, 24"],
      ["Wednesday", 3, "11, 18, 25"], ["Thursday", 3, "12, 19, 26"],
      ["Friday", 3, "13, 20, 27"], ["Saturday", 1, "14"],
      ["Sunday", 4, "1, 8, 15, 22"],
    ],
  },
  {
    title: "March 2026 — Hazendal",
    rate: "current",
    note: "March 2026 price increase applied.",
    rows: [
      ["Monday", 4, "2, 9, 16, 23"], ["Tuesday", 4, "3, 10, 17, 24"],
      ["Wednesday", 4, "4, 11, 18, 25"], ["Thursday", 4, "5, 12, 19, 26"],
      ["Friday", 4, "6, 13, 20, 27"], ["Saturday", 2, "7, 14"],
      ["Sunday", 4, "1, 8, 15, 22"],
    ],
  },
  {
    title: "April 2026",
    rate: "current",
    rows: [
      ["Monday", 2, "13, 20"], ["Tuesday", 3, "14, 21, 28"],
      ["Wednesday", 4, "8, 15, 22, 29"], ["Thursday", 4, "9, 16, 23, 30"],
      ["Friday", 3, "10, 17, 24"], ["Saturday", 3, "11, 18, 25"],
      ["Sunday", 3, "12, 19, 26"],
    ],
  },
  {
    title: "May 2026",
    rate: "current",
    rows: [
      ["Monday", 4, "4, 11, 18, 25"], ["Tuesday", 4, "5, 12, 19, 26"],
      ["Wednesday", 4, "6, 13, 20, 27"], ["Thursday", 4, "7, 14, 21, 28"],
      ["Friday", 4, "8, 15, 22, 29"], ["Saturday", 5, "2, 9, 16, 23, 30"],
      ["Sunday", 5, "3, 10, 17, 24, 31"],
    ],
  },
  {
    title: "June 2026",
    rate: "current",
    rows: [
      ["Monday", 3, "1, 8, 22"], ["Tuesday", 3, "2, 9, 23"],
      ["Wednesday", 4, "3, 10, 17, 24"], ["Thursday", 4, "4, 11, 18, 25"],
      ["Friday", 4, "5, 12, 19, 26"], ["Saturday", 3, "6, 13, 20"],
      ["Sunday", 3, "7, 14, 21"],
    ],
  },
  {
    title: "July 2026",
    rate: "current",
    rows: [
      ["Monday", 1, "27"], ["Tuesday", 2, "21, 28"],
      ["Wednesday", 2, "22, 29"], ["Thursday", 2, "23, 30"],
      ["Friday", 2, "24, 31"], ["Saturday", 1, "25"], ["Sunday", 1, "26"],
    ],
  },
  {
    title: "August 2026",
    rate: "current",
    rows: [
      ["Monday", 4, "3, 17, 24, 31"], ["Tuesday", 4, "4, 11, 18, 25"],
      ["Wednesday", 4, "5, 12, 19, 26"], ["Thursday", 4, "6, 13, 20, 27"],
      ["Friday", 4, "7, 14, 21, 28"], ["Saturday", 5, "1, 8, 15, 22, 29"],
      ["Sunday", 4, "2, 16, 23, 30"],
    ],
  },
  {
    title: "September 2026",
    rate: "current",
    rows: [
      ["Monday", 3, "7, 14, 21"], ["Tuesday", 4, "1, 8, 15, 22"],
      ["Wednesday", 4, "2, 9, 16, 23"], ["Thursday", 3, "3, 10, 17"],
      ["Friday", 3, "4, 11, 18"], ["Saturday", 3, "5, 12, 19"],
      ["Sunday", 3, "6, 13, 20"],
    ],
  },
  {
    title: "October 2026",
    rate: "current",
    rows: [
      ["Monday", 3, "12, 19, 26"], ["Tuesday", 4, "6, 13, 20, 27"],
      ["Wednesday", 4, "7, 14, 21, 28"], ["Thursday", 4, "8, 15, 22, 29"],
      ["Friday", 4, "9, 16, 23, 30"], ["Saturday", 4, "10, 17, 24, 31"],
      ["Sunday", 3, "11, 18, 25"],
    ],
  },
  {
    title: "November 2026",
    rate: "current",
    rows: [
      ["Monday", 5, "2, 9, 16, 23, 30"], ["Tuesday", 4, "3, 10, 17, 24"],
      ["Wednesday", 4, "4, 11, 18, 25"], ["Thursday", 4, "5, 12, 19, 26"],
      ["Friday", 4, "6, 13, 20, 27"], ["Saturday", 4, "7, 14, 21, 28"],
      ["Sunday", 5, "1, 8, 15, 22, 29"],
    ],
  },
  {
    title: "December 2026",
    rate: "current",
    rows: [
      ["Monday", 1, "7"], ["Tuesday", 2, "1, 8"], ["Wednesday", 2, "2, 9"],
      ["Thursday", 1, "3"], ["Friday", 1, "4"], ["Saturday", 1, "5"],
      ["Sunday", 1, "6"],
    ],
  },
];

export const registrationChecklist = [
  "Parent or guardian contact details and relationship to the junior",
  "Preferred academy location and intended joining month",
  "Additional and emergency contact details",
  "Billing contact and address",
  "Junior name, date of birth, school, grade and relevant medical or support information",
  "Programme, coach, preferred day and preferred time",
  "Golf club membership, handicap and previous academy-event participation",
  "Scheduling considerations, consent and acceptance of the current terms",
] as const;
