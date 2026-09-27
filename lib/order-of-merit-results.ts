import type { OomDivisionId } from "@/lib/order-of-merit";

export type OomStanding = {
  id: string;
  position: number;
  player: string;
  division: OomDivisionId;
  metric: number;
  rounds: number;
  frontNine: number;
  backNine: number;
  photoUrl?: string;
  photoConsent: "granted" | "not_provided";
};

export type OomWeeklyStanding = {
  position: number;
  player: string;
  stablefordPoints: number;
  oomPoints: number;
  handicapIndex: number;
  courseHandicap: number;
};

export type OomPublishedRound = {
  id: string;
  label: string;
  date: string;
  division: OomDivisionId;
  status: "published" | "cancelled";
  results?: readonly OomWeeklyStanding[];
};

type StandingTuple = readonly [
  player: string,
  metric: number,
  rounds: number,
  frontNine: number,
  backNine: number,
];

const legacyPhotoByPlayer: Readonly<Record<string, string>> = {
  "Abdul Maalik Dout": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Abdul_Dout.jpeg",
  "Alexander Ras": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Andion van der Merwe": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "André Hoffmann": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Andre-_Hoffmann.jpeg",
  "Anru Vermeulen": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Anru_Vermeulen-.jpg",
  "Blake Smal": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Christiaan Booysen": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Christiaan Taljaard": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Christiaan_Taljaard.jpg",
  "Christiaan Van Blerk": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Christiaan_Van-Blerk.jpg",
  "Christian Rabie": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Christian_Rabie.jpg",
  "Connor Brits": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Connor_Brits.jpeg",
  "Daniël Forbes": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Daniel-_Forbes.jpg",
  "Daniel Myburgh": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Daniel_Myburgh-removebg-preview.png",
  "Dian Van Zyl": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_DIAN_VAN-ZYL.jpg",
  "Drian Britz": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Eben Lerm": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Eben Strauss": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Eben_Strauss.jpg",
  "Eben van der Watt": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Eben_van-der-Watt.jpeg",
  "Emma de Goede": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Emma_de-Goede.jpeg",
  "Ewald Van Zyl": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_EWALD_VAN-ZYL.jpg",
  "Frederick Jacobus Wentzel": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Cobus_Wentzel.jpg",
  "Handré Vermeulen": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Handre_Vermeulen.jpg",
  "Hannah Van Schalkwyk": "https://puremotiongolf.com/wp-content/uploads/Avatar-Girl.jpg",
  "Herman Coetzee": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Herman_Coetzee.jpg",
  "Hunter Thompson": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Hunter_Thompson.jpeg",
  "James John Winshaw": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_James-John_winshaw.jpg",
  "James Schenck": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Jan Abraham Coetzee": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Jayden De Bruyn": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "JC (Johannes Cornelius) Dirkse van Schalkwyk": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_JC-Johannes-Cornelius_Dirkse-van-Schalkwyk.jpeg",
  "John O'Kennedy": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Josh Adam": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Josh_Adam.jpg",
  "Joshua Peters": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Joshua Watson": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Joshua-_Watson.jpg",
  "Landen Cockrell": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Landen-_Cockrell-.jpeg",
  "Le Febre Malherbe": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Lorenzo Vlok": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Luca Botes": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Lukas van der Merwe": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Lukas_van-der-Merwe.jpg",
  "Luke Mausling": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Luke_Mausling.jpeg",
  "Mason Acar": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Mason_Acar.jpg",
  "Mason Conner Joubert": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Matthew Walters": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Matthew_Walters-2.jpg",
  "Michal Ras": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Neil van der Nest": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Neil_van-der-Nest.jpg",
  "Nicholas Albertyn": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Nicholas-_Albertyn.jpg",
  "Nicholas Hanekom": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Nicholas_Hanekom.jpg",
  "Noah Boddington": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Noah_Boddington.jpg",
  "Oscar Stanton": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Oscar_Stanton.jpg",
  "Rafah Osborne": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Rafah-Osborne.jpg",
  "Ruben van der Sandt": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Seth Stanton": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Seth_Stanton.jpg",
  "Sidong Shi": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Thomas Roos": "https://puremotiongolf.com/wp-content/uploads/OOM_Thomas_Roos.jpg",
  "Thys Greeff": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Thys_Greeff.jpeg",
  "Zach Watson": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Zach_Watson.jpg",
  "Zandre De Bruyn": "https://puremotiongolf.com/wp-content/uploads/Avatar-Boy.jpg",
  "Zema Homani": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Zema_Homani.jpeg",
  "Zivan Alexander": "https://puremotiongolf.com/wp-content/uploads/OOM_2026_Zivan_Alexander.jpg",
};

function localPlayerPhoto(player: string): string | undefined {
  const sourceUrl = legacyPhotoByPlayer[player];

  if (!sourceUrl) {
    return undefined;
  }

  const fileName = sourceUrl.split("/").at(-1);
  return fileName ? `/images/order-of-merit/players/${fileName}` : undefined;
}

function toStandings(
  division: OomDivisionId,
  rows: readonly StandingTuple[],
  prefix: string,
): readonly OomStanding[] {
  return rows.map(([player, metric, rounds, frontNine, backNine], index) => {
    const photoUrl = localPlayerPhoto(player);

    return {
      id: `${prefix}-${index + 1}`,
      position: index + 1,
      player,
      division,
      metric,
      rounds,
      frontNine,
      backNine,
      photoUrl,
      photoConsent: photoUrl ? "granted" : "not_provided",
    };
  });
}

const stablefordRows: readonly StandingTuple[] = [
  ["John O'Kennedy", 952, 20, 9, 11],
  ["Luca Botes", 757, 19, 9, 10],
  ["JC (Johannes Cornelius) Dirkse van Schalkwyk", 546, 18, 9, 10],
  ["Frederick Jacobus Wentzel", 524, 16, 8, 8],
  ["Zivan Alexander", 495, 18, 8, 10],
  ["Christiaan Taljaard", 449, 13, 5, 8],
  ["Jan Abraham Coetzee", 420, 14, 5, 9],
  ["Oscar Stanton", 382, 11, 6, 5],
  ["Dian Van Zyl", 374, 14, 8, 6],
  ["Nicholas Albertyn", 309, 15, 7, 8],
  ["Anru Vermeulen", 303, 7, 5, 2],
  ["Seth Stanton", 298, 12, 7, 5],
  ["Neil van der Nest", 266, 7, 3, 4],
  ["Ewald Van Zyl", 261, 9, 4, 5],
  ["Jayden De Bruyn", 240, 9, 4, 5],
  ["Connor Brits", 173, 9, 4, 5],
  ["Nicholas Hanekom", 145, 4, 1, 3],
  ["Drian Britz", 142, 7, 4, 3],
  ["Christiaan Van Blerk", 125, 11, 5, 6],
  ["Thomas Roos", 120, 6, 2, 4],
  ["Eben van der Watt", 113, 4, 3, 1],
  ["Christiaan Booysen", 95, 3, 2, 1],
  ["Christian Rabie", 85, 5, 2, 3],
  ["Zema Homani", 75, 4, 1, 3],
  ["Joshua Watson", 65, 6, 4, 2],
  ["Matthew Walters", 50, 5, 2, 3],
  ["André Hoffmann", 35, 2, 1, 1],
  ["James John Winshaw", 20, 2, 0, 2],
] as const;

const kickstarterRows: readonly StandingTuple[] = [
  ["Abdul Maalik Dout", 32.88, 8, 3, 5],
  ["Rafah Osborne", 34.08, 13, 7, 6],
  ["Hunter Thompson", 34.09, 22, 11, 11],
  ["Sidong Shi", 34.18, 17, 10, 7],
  ["Noah Boddington", 34.35, 17, 9, 8],
  ["Thys Greeff", 36.25, 4, 2, 2],
  ["Michal Ras", 36.53, 19, 11, 8],
  ["Andion van der Merwe", 37.4, 5, 3, 2],
  ["Joshua Peters", 37.88, 16, 8, 8],
  ["Alexander Ras", 38.39, 18, 9, 9],
  ["James Schenck", 39.14, 7, 4, 3],
  ["Ruben van der Sandt", 40, 3, 1, 2],
  ["Handré Vermeulen", 40.12, 17, 7, 10],
  ["Mason Conner Joubert", 40.13, 8, 3, 5],
  ["Le Febre Malherbe", 40.14, 7, 6, 1],
  ["Landen Cockrell", 40.58, 12, 7, 5],
  ["Daniel Myburgh", 40.63, 19, 10, 9],
  ["Lorenzo Vlok", 41.85, 13, 8, 5],
  ["Mason Acar", 42.1, 10, 4, 6],
  ["Daniël Forbes", 42.18, 17, 9, 8],
  ["Eben Lerm", 42.38, 8, 3, 5],
  ["Hannah Van Schalkwyk", 43.06, 16, 9, 7],
  ["Zandre De Bruyn", 43.53, 15, 7, 8],
  ["Lukas van der Merwe", 44.08, 12, 7, 5],
  ["Luke Mausling", 45.17, 6, 3, 3],
  ["Josh Adam", 46.09, 11, 6, 5],
  ["Herman Coetzee", 48, 9, 2, 7],
  ["Blake Smal", 49.25, 8, 4, 4],
  ["Zach Watson", 53, 3, 1, 2],
  ["Emma de Goede", 53.25, 4, 2, 2],
  ["Eben Strauss", 57.5, 2, 1, 1],
] as const;

const graduateRows: readonly StandingTuple[] = [
  ["Frederick Jacobus Wentzel", 36, 1, 0, 1],
  ["James John Winshaw", 36.33, 3, 2, 1],
  ["Thomas Roos", 37, 15, 7, 8],
  ["JC (Johannes Cornelius) Dirkse van Schalkwyk", 38.5, 2, 1, 1],
  ["Connor Brits", 38.56, 9, 4, 5],
  ["Jayden De Bruyn", 39.11, 9, 4, 5],
  ["Matthew Walters", 39.92, 12, 7, 5],
] as const;

export const oomAnnualStandings = {
  standard: toStandings("standard", stablefordRows, "std"),
  kickstarter: toStandings("kickstarter", kickstarterRows, "kick"),
  graduates: toStandings("kickstarter", graduateRows, "grad"),
} as const;

export const latestStablefordResults: readonly OomWeeklyStanding[] = [
  { position: 1, player: "Luca Botes", stablefordPoints: 23, oomPoints: 60, handicapIndex: 22.4, courseHandicap: 22 },
  { position: 2, player: "John O'Kennedy", stablefordPoints: 22, oomPoints: 52, handicapIndex: 12, courseHandicap: 11 },
  { position: 3, player: "Christiaan Taljaard", stablefordPoints: 20, oomPoints: 45, handicapIndex: 12.9, courseHandicap: 7 },
  { position: 3, player: "Nicholas Hanekom", stablefordPoints: 20, oomPoints: 45, handicapIndex: 16, courseHandicap: 11 },
  { position: 5, player: "Zivan Alexander", stablefordPoints: 18, oomPoints: 30, handicapIndex: 18.8, courseHandicap: 13 },
  { position: 6, player: "JC Dirkse van Schalkwyk", stablefordPoints: 17, oomPoints: 25, handicapIndex: 15.2, courseHandicap: 10 },
  { position: 6, player: "Thomas Roos", stablefordPoints: 17, oomPoints: 25, handicapIndex: 31.6, courseHandicap: 26 },
  { position: 8, player: "Christiaan Booysen", stablefordPoints: 16, oomPoints: 15, handicapIndex: 26.4, courseHandicap: 26 },
  { position: 8, player: "André Hoffmann", stablefordPoints: 16, oomPoints: 15, handicapIndex: 21.4, courseHandicap: 16 },
  { position: 8, player: "Jan Abraham Coetzee", stablefordPoints: 16, oomPoints: 15, handicapIndex: 10.9, courseHandicap: 6 },
  { position: 8, player: "Zema Homani", stablefordPoints: 16, oomPoints: 15, handicapIndex: 24, courseHandicap: 18 },
  { position: 12, player: "Frederick Jacobus Wentzel", stablefordPoints: 15, oomPoints: 10, handicapIndex: 15.2, courseHandicap: 10 },
  { position: 13, player: "Seth Stanton", stablefordPoints: 14, oomPoints: 10, handicapIndex: 24, courseHandicap: 18 },
  { position: 14, player: "Oscar Stanton", stablefordPoints: 13, oomPoints: 10, handicapIndex: 24, courseHandicap: 18 },
  { position: 15, player: "Joshua Watson", stablefordPoints: 5, oomPoints: 10, handicapIndex: 24, courseHandicap: 18 },
] as const;

const publishedStablefordDates = [
  ["2026-09-15", "Term 3 · Round 8"],
  ["2026-09-08", "Term 3 · Round 7"],
  ["2026-08-25", "Term 3 · Round 5"],
  ["2026-08-18", "Term 3 · Round 4"],
  ["2026-08-11", "Term 3 · Round 3"],
  ["2026-08-04", "Term 3 · Round 2"],
  ["2026-07-28", "Term 3 · Round 1"],
  ["2026-06-23", "Term 2 · Round 9"],
  ["2026-06-09", "Term 2 · Round 8"],
  ["2026-06-02", "Term 2 · Round 7"],
  ["2026-05-26", "Term 2 · Round 6"],
  ["2026-05-19", "Term 2 · Round 5"],
  ["2026-05-05", "Term 2 · Round 3"],
  ["2026-04-28", "Term 2 · Round 2"],
  ["2026-04-14", "Term 2 · Round 1"],
  ["2026-03-24", "Term 1 · Round 8"],
  ["2026-03-17", "Term 1 · Round 7"],
  ["2026-03-10", "Term 1 · Round 6"],
  ["2026-02-24", "Term 1 · Round 5"],
  ["2026-02-17", "Term 1 · Round 4"],
  ["2026-02-10", "Term 1 · Round 3"],
  ["2026-02-03", "Term 1 · Round 2"],
  ["2026-01-27", "Term 1 · Round 1"],
] as const;

export const oomPublishedRounds: readonly OomPublishedRound[] = publishedStablefordDates.map(
  ([date, label], index) => ({
    id: `published-${date}`,
    label,
    date,
    division: "standard",
    status: "published",
    results: index === 0 ? latestStablefordResults : undefined,
  }),
);

export const oomResultsSnapshot = {
  source: "Pure Motion Golf 2026 published standings",
  capturedOn: "2026-09-26",
  note: "Local fixture snapshot for interface development. Replace through the future results-management workflow.",
} as const;
