# Order of Merit content audit

Audited locally on 26 September 2026 from:

- `https://puremotiongolf.com/junior-golf/order-of-merit/`
- `https://puremotiongolf.com/junior-golf/order-of-merit/order-of-merit-terms/`

This document is the implementation index for rebuilding Order of Merit (OOM). It is a content and product inventory, not approval to change Supabase, deploy, or reproduce the old page layout.

## Recommended route structure

1. `/juniors/order-of-merit` — public OOM overview, divisions, live leaderboards, weekly results, gallery and calls to action.
2. `/juniors/order-of-merit/register` — the OOM booking and registration flow.
3. `/juniors/order-of-merit/terms` — dates, prices, competition rules, scoring, prizes and legal terms.
4. `/juniors` — retain only a concise OOM teaser linking to the dedicated OOM page.

## Public OOM overview

- Competition began in 2012 at Durbanville Golf Club.
- Open to course-ready boys and girls nationwide, aged 6 to 18 as at 1 January 2026.
- Nine-hole Tuesday competition during public-school terms.
- No golf-club membership or official handicap is required to start.
- Two divisions: Standard/Stableford and Kickstarter.
- Kickstarter was introduced in June 2022 for juniors who need a shorter course.
- 31 rounds are advertised for 2026, averaging about seven rounds per term.
- Registration opens Wednesday and closes Saturday before the following Tuesday round.
- Check-in is 15:00–15:15; tee times begin around 15:20 depending on season and tee availability.
- Venue: Durbanville Golf Club, Sport Way, Durbanville, Western Cape.
- Standard price: R80 per player per round.
- 2026 JAM price: R35 per player per round.
- A full-term or full-year booking receives a 10% discount.
- Results are published weekly and promoted through the academy’s social channels.

## Course-ready definition

A course-ready junior understands the aim and basic etiquette of golf, can make ball contact, can complete a green in no more than four putts, has basic chipping skills, knows safe positioning, maintains pace, understands the warning “fore”, follows green etiquette and tees off within the tee-marker boundaries. The flow must offer an assessment when a parent is unsure.

## Standard division

- Best for players comfortable on a standard-length nine-hole course and those learning Stableford competition.
- Alternates between the front and back nine.
- Boys aged 13 and older use blue tees.
- Boys aged 12 and younger use red tees.
- Girls use red tees.
- The player’s Handicap Index on the day determines course handicap.
- Players without an official handicap initially receive an index of 36.0.
- After six OOM rounds, a player without an official handicap must begin the official handicapping process.
- Players keep their own scorecard and mark a playing partner’s card.
- Cards must be returned to the scoring table before leaving.
- Fairways hit, greens in regulation and putts must be recorded.
- Players aged 6–10 must be accompanied by an adult.

## Kickstarter division

- Shorter adapted nine-hole course for beginner juniors.
- No official Handicap Index is required.
- Players progress to Standard as competence and confidence improve.
- Gross-score format with a maximum score of seven per hole.
- After six strokes without holing out, the player picks up and records seven.
- Putts must be recorded on every hole.
- Players keep their own scorecard and mark a playing partner’s card.
- Players aged 6–10 must be accompanied by an adult, who may assist with scoring.

## Scoring, leaderboards and prizes

### Stableford OOM points

- 1st: 60
- 2nd: 52
- 3rd: 45
- 4th: 38
- 5th: 30
- 6th: 25
- 7th: 20
- 8th: 15
- 9th onward: 10

Tied players each receive the points for that placing and subsequent places are skipped by the number of tied players. Weekly results show Stableford points and OOM points. The annual leaderboard totals OOM points and tracks rounds, front-nine rounds and back-nine rounds.

Kickstarter weekly results use gross score. The annual leaderboard uses average gross score and also tracks total rounds plus front/back-nine participation.

Annual public result surfaces currently include:

- Stableford Division annual leaderboard.
- Kickstarter Graduates table.
- Kickstarter Division annual leaderboard.
- Stableford weekly results archive.
- Kickstarter weekly results archive.
- 2025 final-results archive.

Prize qualification requires at least 12 rounds, including six front-nine and six back-nine rounds. Categories include overall leaders, statistical categories, putting, most improved and sportsmanship. A player may receive only one year-end prize. Moving between Kickstarter and Standard restarts the player’s scoring/results.

## 2026 published dates and prices

### Term 1 — 8 rounds

27 January; 3, 10, 17 and 24 February; 10, 17 and 24 March.

- Standard full-term price: R576 after 10% discount.
- JAM full-term price: R252 after 10% discount.

### Term 2

14 and 28 April; 5, 12, 19 and 26 May; 2, 9 and 23 June. The source marks 12 May as cancelled while its price summary still describes eight payable rounds.

- Standard full-term price shown: R576 after 10% discount.
- JAM full-term price shown: R252 after 10% discount.

### Term 3 — 7 rounds

28 July; 4, 11, 18 and 25 August; 8 and 15 September. The source also lists 22 September as cancelled.

- Standard full-term price: R504 after 10% discount.
- JAM full-term price: R220.50 after 10% discount.

### Term 4 — 8 rounds

13, 20 and 27 October; 3, 10, 17 and 24 November; 1 December.

- Standard full-term price: R576 after 10% discount.
- JAM full-term price: R252 after 10% discount.

Dates, cancellation state, capacity state and division availability must be editable records rather than hard-coded page copy.

## Registration flow inventory

The current form is a multi-step booking flow and must remain separate from general account creation.

1. Welcome/current date and booking instructions.
2. Parent/guardian details: name, relationship, email, phone, physical address, alternate person bringing the player and referral source.
3. Player details: legal name, known-as name, surname, gender, school, grade, age on 1 January, date of birth, Handicap Index and division.
4. Coach and membership: PMGA coach or other coach, DGC membership and number, 2026 JAM status and number.
5. Media/support: leaderboard photo, social-media consent and required accommodations.
6. Term-by-term booking: individual dates or whole-term selection, division capacity, closed/cancelled dates and 10% term discount.
7. Booking summary: selected rounds by term, total rounds and calculated total cost.
8. Consent: acknowledgement of OOM terms.
9. Payment handoff: tee time is reserved only after payment; the source gives a 12-hour payment window.

Important behaviours:

- One form per player.
- Users may book several rounds/terms at once or return for an individual future round.
- Registration is available Wednesday through Saturday.
- Capacity differs by date and division (Stableford/Kickstarter).
- A selection can be fully booked for one division while remaining open for the other.
- JAM pricing is conditional on active membership on each round date.
- If JAM is cancelled, future booked rounds convert to the non-JAM price.

## Competition rules

- Space is limited; payment confirms the tee time.
- No refunds, credits or carry-overs for participant cancellation or non-attendance.
- PMGA cancellation for weather or course closure qualifies for refund/carry-over.
- Tee times are emailed Sunday evening or Monday morning.
- Cancellations should be returned by email or WhatsApp by Monday end of day; Tuesday emergencies should be reported immediately.
- Repeated no-shows may result in removal from the competition.
- Players must arrive 15–20 minutes before tee time and collect a scorecard.
- A player not checked in 15 minutes before tee time can be treated as a no-show.
- Dress code: neat golf attire, collared or crew-neck shirt, sports/long pants or golf shorts, closed sport/golf shoes, suitable weather gear and hats. No T-shirts, jeans, tracksuit pants or sandals.
- DGC requires every golfer to carry a sandbag for divots.
- Adults accompanying players must not intervene with other juniors or the course of play; concerns go to organisers after the round.
- Signing a lower-than-actual hole score causes disqualification; a signed higher score stands.
- Missing required statistics in any round removes the player from the statistics competition for the rest of the year.
- PMGA retains right of admission and may terminate participation.
- Registration includes a binding fee undertaking, rules acceptance, golf-risk acknowledgement, waiver and indemnity.

## Supporting content on the current page

- 2025 OOM image gallery.
- 2025 finalists/results archive.
- JAM membership promotion and assessment call to action.
- Henru Walters success story.
- Jordan Rothman success story.
- Puma and Cobra sponsor links.

These can remain below the core competition/results experience, but must not obscure current registration, dates or leaderboards.

## Issues to resolve before implementation

- Source content contains changing availability states and must not be frozen into JSX.
- The term-two date/count wording conflicts after a cancelled round; confirm the official payable round count.
- The main page advertises 31 rounds while cancelled dates remain visible in the terms list; distinguish scheduled, cancelled and playable counts.
- Confirm whether 2025 gallery/testimonials should be migrated in full or curated.
- Confirm consent and retention requirements before publishing junior names and photos in the rebuilt leaderboards.
- Confirm the payment provider/handoff before enabling production registration.
- Build against local sample data first. Do not change Supabase until SQL is reviewed and manually applied by the project owner.

## Future admin and data-management design

OOM must be an operational feature managed from the dashboard, not a set of hard-coded marketing components. Public pages, parent registration, staff operations and results should all read from the same source records.

### Dashboard navigation

Add an `Order of Merit` workspace for admin and receptionist roles with these views:

1. **Overview** — current season health, next round, capacity, outstanding payments, registrations requiring review and unpublished results.
2. **Season setup** — year, registration window rules, standard/JAM prices, discounts, scoring settings, prize thresholds and publication state.
3. **Rounds** — term, date, front/back nine, status, cancellation reason, registration dates, division capacity and division availability.
4. **Registrations** — parent/player, selected rounds, division, JAM/DGC status, amount, payment deadline, payment state and operational notes.
5. **Players** — linked parent account/dependent, course-ready status, division, handicap, coach, consent, accommodations and competition history.
6. **Tee sheet** — confirmed field, check-in, tee time/group, no-shows and printable/exportable event-day view.
7. **Results** — score entry, scorecard verification, FW/GIR/putts, penalties/disqualification, review and publication.
8. **Leaderboards** — calculated annual Stableford, Kickstarter and graduate standings with publish controls.
9. **Content** — public introduction, course descriptions, course-ready guidance, sponsors, gallery and success stories.
10. **Terms** — versioned competition rules with an effective date and immutable copy accepted by each registration.
11. **Archive** — previous seasons, final results, galleries and exports.

### Role responsibilities

- **Admin:** full season configuration, pricing, scoring, publishing, terms, content and destructive actions.
- **Receptionist:** rounds, capacity, registrations, payment status, communication, tee-sheet administration and check-in.
- **Coach:** course-ready decisions, player division/handicap, tee groups, score/stat entry and result review.
- **Client/parent:** their linked juniors, registrations, payment state, tee-time notices, results and accepted terms.
- **Public:** published competition details, available rounds, leaderboards, weekly results, gallery and archives only.

Every material staff change should create an existing `audit_events` entry.

### Proposed normalized entities

This is a design target for a later SQL migration. It must not be applied automatically.

- `oom_seasons` — one row per competition year and the season-level configuration.
- `oom_divisions` — Standard/Stableford, Kickstarter and future divisions; scoring type and rules belong here.
- `oom_rounds` — date, term, nine played, registration window, overall status and publication state.
- `oom_round_divisions` — capacity, availability and price overrides for each division in each round.
- `oom_player_profiles` — one-to-one extension of the existing `dependents` row for competition-specific details; do not create a second unrelated child record.
- `oom_registrations` — one parent submission/booking header with status, totals, payment deadline and accepted terms version.
- `oom_registration_rounds` — selected round/division rows, locked price, discount and attendance state.
- `oom_payments` — provider reference, amount, state, timestamps and reconciliation notes; reusable generic payments may replace this later.
- `oom_tee_assignments` — tee time, group, start nine and check-in state per confirmed entry.
- `oom_results` — verified round result, Stableford/OOM points or Kickstarter gross score, penalties and publication state.
- `oom_statistics` — per-round FW, GIR and putts where required.
- `oom_terms_versions` — versioned rules and legal text accepted by registration ID and timestamp.
- `oom_media` — gallery/player media metadata and consent linkage rather than untracked image URLs.
- `oom_content_blocks` — optional structured public-page content for editable copy, stories and sponsor placement.

Annual leaderboards should be database views or server-calculated projections from verified published results. They should not be manually maintained duplicate tables.

### Core operational workflow

1. Admin creates a new season, preferably by cloning the previous season’s structure without copying registrations or results.
2. Staff add/edit rounds, prices, capacity and division availability, then publish the season.
3. Parent selects a linked junior and available rounds. Eligibility, JAM status, discount and capacity are calculated server-side.
4. Submission creates a pending registration and a short-lived capacity hold.
5. Payment confirmation changes selected entries to confirmed; expiry or failed payment releases the held places.
6. Reception builds the tee sheet and sends tee-time communications.
7. Event-day staff check players in and record attendance/no-show state.
8. Coaches or authorised staff enter results and statistics; a second review publishes them.
9. Weekly and annual leaderboards update from published verified results.
10. At year end, the season becomes read-only and remains available in the public archive.

### Important integrity rules

- Pricing is calculated and stored server-side; never trust amounts posted by the browser.
- Each booked round stores its applied price and discount so later price edits do not rewrite historic totals.
- Capacity checks and confirmation must be transactional to prevent overbooking.
- Division capacity is independent: one division may be full while another remains open.
- A cancelled round must preserve registrations, payment history and audit history.
- JAM eligibility must be evaluated for the round date, not only the form-submission date.
- A registration stores the exact terms version accepted by the parent.
- Junior names/photos require explicit publication consent and staff visibility must follow role-based access.
- Draft results are private; only verified published results feed public tables and leaderboards.
- Historical seasons remain immutable except for tightly controlled admin corrections recorded in the audit log.
