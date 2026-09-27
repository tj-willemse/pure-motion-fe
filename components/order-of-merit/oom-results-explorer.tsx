"use client";

import { ArrowUpDown, CalendarDays, Search, Trophy, UserRoundCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  latestStablefordResults,
  oomAnnualStandings,
  oomPublishedRounds,
  type OomStanding,
} from "@/lib/order-of-merit-results";

type ResultsView = "annual" | "weekly" | "graduates";
type AnnualDivision = "standard" | "kickstarter";
type SortKey = "position" | "player" | "metric" | "rounds";

const viewOptions: { id: ResultsView; label: string; icon: typeof Trophy }[] = [
  { id: "annual", label: "Annual standings", icon: Trophy },
  { id: "weekly", label: "Weekly results", icon: CalendarDays },
  { id: "graduates", label: "Kickstarter graduates", icon: UserRoundCheck },
];

export function OomResultsExplorer() {
  const [view, setView] = useState<ResultsView>("annual");
  const [division, setDivision] = useState<AnnualDivision>("standard");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("position");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAll, setShowAll] = useState(false);
  const [roundId, setRoundId] = useState(oomPublishedRounds[0]?.id ?? "");

  const rows = useMemo(() => {
    const source = view === "graduates"
      ? oomAnnualStandings.graduates
      : oomAnnualStandings[division];
    const normalizedQuery = query.trim().toLocaleLowerCase("en-ZA");
    const filtered = normalizedQuery
      ? source.filter((row) => row.player.toLocaleLowerCase("en-ZA").includes(normalizedQuery))
      : [...source];

    return filtered.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "player") return a.player.localeCompare(b.player) * direction;
      return (a[sortKey] - b[sortKey]) * direction;
    });
  }, [division, query, sortDirection, sortKey, view]);

  const visibleRows = showAll || query ? rows : rows.slice(0, 12);
  const selectedRound = oomPublishedRounds.find((round) => round.id === roundId) ?? oomPublishedRounds[0];
  const selectedWeeklyRows = selectedRound?.results ?? [];

  function changeView(next: ResultsView) {
    setView(next);
    setQuery("");
    setShowAll(false);
    setSortKey("position");
    setSortDirection("asc");
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection(key === "metric" ? "desc" : "asc");
  }

  return (
    <div className="oom-results-explorer">
      <nav className="oom-results-tabs" aria-label="Order of Merit result views">
        {viewOptions.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            className={view === id ? "is-active" : ""}
            aria-pressed={view === id}
            onClick={() => changeView(id)}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      {view === "weekly" ? (
        <WeeklyResults
          roundId={roundId}
          onRoundChange={setRoundId}
          selectedRoundLabel={selectedRound?.label ?? "Published round"}
          selectedRoundDate={selectedRound?.date ?? "2026-09-15"}
          rows={selectedWeeklyRows}
          isLatest={Boolean(selectedRound?.results)}
        />
      ) : (
        <>
          <div className="oom-results-toolbar">
            <div>
              {view === "annual" && (
                <div className="oom-results-segmented" aria-label="Leaderboard division">
                  <button type="button" className={division === "standard" ? "is-active" : ""} onClick={() => { setDivision("standard"); setShowAll(false); }}>
                    Stableford
                  </button>
                  <button type="button" className={division === "kickstarter" ? "is-active" : ""} onClick={() => { setDivision("kickstarter"); setShowAll(false); }}>
                    Kickstarter
                  </button>
                </div>
              )}
              {view === "graduates" && (
                <p className="oom-results-description">
                  Players who moved from the adapted Kickstarter course into the Stableford division during 2026.
                </p>
              )}
            </div>
            <label className="oom-results-search">
              <Search size={17} aria-hidden="true" />
              <input aria-label="Find a player" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a player" />
            </label>
          </div>

          <StandingsTable
            rows={visibleRows}
            metricLabel={division === "standard" && view !== "graduates" ? "OOM points" : "Gross avg."}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={toggleSort}
          />

          {rows.length > 12 && !query && (
            <div className="oom-results-footer">
              <span>Showing {showAll ? rows.length : 12} of {rows.length} players</span>
              <button type="button" onClick={() => setShowAll((current) => !current)}>
                {showAll ? "Show top 12" : `Show all ${rows.length}`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StandingsTable({
  rows,
  metricLabel,
  sortKey,
  sortDirection,
  onSort,
}: {
  rows: readonly OomStanding[];
  metricLabel: string;
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const ariaSort = (key: SortKey) => sortKey === key
    ? sortDirection === "asc" ? "ascending" : "descending"
    : "none";

  return (
    <div className="oom-results-table-wrap">
      <table className="oom-results-table">
        <thead>
          <tr>
            <SortableHead label="Rank" sortKey="position" ariaSort={ariaSort("position")} onSort={onSort} />
            <th scope="col" aria-label="Player image" />
            <SortableHead label="Player" sortKey="player" ariaSort={ariaSort("player")} onSort={onSort} />
            <SortableHead label={metricLabel} sortKey="metric" ariaSort={ariaSort("metric")} onSort={onSort} />
            <SortableHead label="Rounds" sortKey="rounds" ariaSort={ariaSort("rounds")} onSort={onSort} />
            <th scope="col">Front 9</th>
            <th scope="col">Back 9</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><span className="oom-rank">{row.position}</span></td>
              <td><PlayerAvatar player={row.player} photoUrl={row.photoConsent === "granted" ? row.photoUrl : undefined} /></td>
              <td><strong>{row.player}</strong></td>
              <td><b>{metricLabel === "Gross avg." ? row.metric.toFixed(2) : row.metric}</b></td>
              <td>{row.rounds}</td>
              <td>{row.frontNine}</td>
              <td>{row.backNine}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={7} className="oom-results-empty">No players match that search.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function SortableHead({ label, sortKey, ariaSort, onSort }: { label: string; sortKey: SortKey; ariaSort: "ascending" | "descending" | "none"; onSort: (key: SortKey) => void }) {
  return (
    <th scope="col" aria-sort={ariaSort}>
      <button type="button" onClick={() => onSort(sortKey)}>
        {label}<ArrowUpDown size={13} aria-hidden="true" />
      </button>
    </th>
  );
}

function PlayerAvatar({ player, photoUrl }: { player: string; photoUrl?: string }) {
  const initials = player
    .replace(/\([^)]*\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`oom-player-avatar${photoUrl ? " has-photo" : ""}`}
      style={photoUrl ? { backgroundImage: `url(${photoUrl})` } : undefined}
      aria-hidden="true"
    >
      {!photoUrl && initials}
    </span>
  );
}

function WeeklyResults({
  roundId,
  onRoundChange,
  selectedRoundLabel,
  selectedRoundDate,
  rows,
  isLatest,
}: {
  roundId: string;
  onRoundChange: (value: string) => void;
  selectedRoundLabel: string;
  selectedRoundDate: string;
  rows: readonly typeof latestStablefordResults[number][];
  isLatest: boolean;
}) {
  return (
    <div className="oom-weekly-results">
      <div className="oom-results-toolbar">
        <div>
          <span className="oom-results-eyebrow">Stableford round archive</span>
          <h3>{selectedRoundLabel}</h3>
          <p>{new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${selectedRoundDate}T12:00:00+02:00`))}</p>
        </div>
        <label className="oom-round-select">
          <span>Published round</span>
          <select value={roundId} onChange={(event) => onRoundChange(event.target.value)}>
            {oomPublishedRounds.map((round) => (
              <option key={round.id} value={round.id}>{round.date} · {round.label}</option>
            ))}
          </select>
        </label>
      </div>
      {!isLatest && (
        <div className="oom-archive-notice" role="note">
          This round is indexed in the archive. Its row-level results still need to be included in the historical data migration.
        </div>
      )}
      <div className="oom-results-table-wrap">
        <table className="oom-results-table oom-weekly-table">
          <thead><tr><th>Rank</th><th>Player</th><th>Stableford points</th><th>OOM points</th><th>Handicap index</th><th>Course handicap</th></tr></thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.player}-${index}`}>
                <td><span className="oom-rank">{row.position}</span></td>
                <td><strong>{row.player}</strong></td>
                <td><b>{row.stablefordPoints}</b></td>
                <td>{row.oomPoints}</td>
                <td>{row.handicapIndex}</td>
                <td>{row.courseHandicap}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="oom-results-empty">This published round is indexed, but its player rows have not been migrated into the local build yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
