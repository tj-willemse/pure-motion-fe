# Pure Motion Golf Redesign — Project Handoff

Last updated: 24 September 2026

## 1. Purpose of this document

This is the working handoff for the Pure Motion Golf Academy website redesign. It is intended to give a new developer or a new AI chat enough context to continue without re-discovering the project.

The website is a custom, editorial-style redesign for a Cape Town golf academy operating at Durbanville Golf Club and Hazendal Golf, Stellenbosch. It presents coaching, junior programmes, coaches, events, the driving range, a booking experience, and a customer portal preview.

The current product is a polished frontend implementation. It is **not yet a production booking, payment, authentication, or account-management system**.

## 2. Project location and commands

Project directory:

```text
/Users/tjwillemse/Desktop/Pure Motion Golf/development/fe
```

Run locally:

```bash
cd "/Users/tjwillemse/Desktop/Pure Motion Golf/development/fe"
npm install
npm run dev
```

Local URL:

```text
http://localhost:3000
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

Production preview:

```bash
npm run build
npm run start
```

Important: this directory currently does **not** appear to be a Git repository. Before further major development, initialise Git or move the project into its intended repository so changes can be reviewed and recovered safely.

## 3. Technology and architecture

- Next.js 16.3.5 using the App Router
- React 19.2
- TypeScript 5.9
- Tailwind CSS 4 is installed, but most design work is implemented as custom CSS in `app/globals.css`
- Lucide React supplies interface icons
- `next/image` is used for image optimisation
- DM Sans is loaded with `next/font`
- The content model is currently static TypeScript data, not a CMS
- No backend, database, test suite, authentication provider, payment provider, or booking API is connected

Important files:

```text
app/layout.tsx                 Global metadata, font, header and footer
app/globals.css                Main visual system and responsive styles
components/site-header.tsx     Desktop/mobile navigation and sticky behaviour
components/site-footer.tsx     Footer, contact, locations and social links
components/booking-flow.tsx    Four-step frontend booking prototype
lib/site.ts                    Navigation, coaches, services and site constants
public/brand/                  Logo assets
public/images/                 Optimised WebP website imagery
```

Because this project uses a recent Next.js release, read the relevant local guides under `node_modules/next/dist/docs/` before changing framework-specific code. This requirement is also recorded in `AGENTS.md`.

## 4. Product and design direction

The design language is intentionally clean, spacious, premium and editorial:

- Large, tightly tracked headlines
- Warm off-white page background
- Pure Motion orange as the main accent
- Deep green and near-black supporting colours
- Thin borders, strong grids and restrained shadows
- Full-screen photographic hero sections on the main marketing pages
- Clear calls to action without crowding the primary navigation
- Strong desktop layout with responsive tablet/mobile adaptations

Core colour tokens are declared near the top of `app/globals.css`, including:

```css
--orange: #f36f31;
--orange-dark: #db5720;
--ink: #11110f;
--paper: #f5f3ef;
--green: #213c32;
```

All new raster images must be converted to **WebP** before being placed in `public/images/`. Do not add JPEG or PNG photography unless there is a specific technical reason.

## 5. Global interaction rules already implemented

### Header

The header has two visual states on full-image hero pages:

1. At the top of the page it is transparent, placed over the hero image, with white logo/text/icons.
2. As soon as the user scrolls, hovers the header, or opens a desktop dropdown, a warm off-white background slides in smoothly and the navigation changes to its dark-text state.

The header remains sticky/fixed while scrolling.

The full-image header treatment currently applies to:

- Home
- Coaching
- Juniors
- Driving Range

### Desktop dropdown navigation

The dropdown behaviour is deliberately strict:

- A dropdown opens only while its parent navigation item is active through pointer/focus interaction.
- It stays open while the pointer moves between the parent item and its dropdown.
- It closes when the pointer leaves both the parent item and dropdown.
- It closes on link click, scrolling, route navigation, blur outside the item, or Escape.
- CSS `:hover` and `:focus-within` do not independently force a menu open. React's `activeMenu` state is the single authority.
- This prevents the earlier bug where a clicked navigation item retained focus and the dropdown reopened after scrolling on the destination page.

Do not reintroduce an independent CSS hover/focus opening rule. That would recreate the bug.

### Sticky section navigation

Long pages have a compact section-jump bar that sticks immediately beneath the main header.

Current rules:

- No leading sequence numbers
- No trailing arrows
- No unwanted left border or page-side gap
- Reduced height so it does not dominate the viewport
- Anchor jumps account for the sticky header and sticky submenu so the top of the destination section remains visible
- The orange tile fill is linked continuously to scroll progress
- Scrolling down fills each section item from left to right
- Scrolling up reverses/defills the progress
- Active/past/future classes and `aria-current` are maintained dynamically

### Responsive behaviour

- Desktop has full mega menus.
- Mobile uses an accordion-style navigation.
- Section navigation becomes horizontally scrollable on narrow screens.
- Major grids collapse to one or two columns depending on the breakpoint.
- Full-image heroes remain full viewport height with centred copy.

## 6. Current routes and what has been built

| Route | Status | Main content |
|---|---|---|
| `/` | Built | Full-image homepage hero, services, junior pathway, reasons to choose Pure Motion, academy highlights, locations and CTA |
| `/coaching` | Built | Full-image coaching hero, private lesson pricing, three-lesson packages, ladies golf, technology/fittings and junior team pathway |
| `/juniors` | Built | Full-image junior hero, free assessment, academy programmes, membership, Order of Merit, holiday programme, school team golf and calendar |
| `/coaches` | Built | Director profile, available coach directory, individual anchors and booking links |
| `/team` | Redirect | Permanently redirects to `/coaches` |
| `/events` | Built | Contact information, upcoming events, AIM Series, AIMtoGIVE, Google Calendar embed, results links, achievements and feedback/review CTA |
| `/driving-range` | Built | Full-image driving-range hero, facilities, bucket prices, packages, process, sharing/biometric access information and CTA |
| `/book` | Frontend prototype | Four-step selection for service, location, coach, date and time; accepts service/coach/location query parameters |
| `/portal` | Interface preview | Static sign-in interface and benefits; no real authentication |
| `/_not-found` | Built | Custom not-found handling |

SEO/supporting routes are also implemented:

- `robots.txt`
- `sitemap.xml`
- `manifest.webmanifest`
- Per-page metadata
- Open Graph/Twitter metadata
- JSON-LD structured data on relevant pages

## 7. Content/data currently centralised

`lib/site.ts` contains:

- Canonical site URL and site metadata
- Locations
- Main navigation and all dropdown children
- Eight coach records with roles, locations, availability, biographies and booking state
- Bookable service records and prices
- Rand currency formatting

The desktop navigation currently contains:

- Home
- Coaching: Private lessons, Lesson packages, Ladies golf, Technology and fittings
- Juniors: Free assessment, Junior Academy, Order of Merit, Holiday programmes, School Team Golf, Calendar
- Team: Eight coach profiles
- Contact & Events: Contact, Current events, AIM Series, Academy calendar, Fixtures and results, Feedback
- Driving Range: Facilities, Bucket prices, Package deals, How it works, Add a package user

## 8. Image inventory

Current deployed image assets are all WebP:

```text
public/images/home/home-hero.webp
public/images/home/coaching-lesson.webp
public/images/home/coaching-package.webp
public/images/home/coaching-team.webp
public/images/home/juniors-hero.webp
public/images/home/junior-coaching.webp
public/images/home/driving-range-hero.webp
public/images/home/hero-course.webp
public/images/home/hero-golfer.webp
public/images/coaches/*.webp
```

Key assignments:

- Homepage hero: `home-hero.webp`
- Coaching hero: `coaching-lesson.webp`
- Coaching package feature: `coaching-package.webp`
- Juniors hero: `juniors-hero.webp`
- Driving-range hero: `driving-range-hero.webp`

The driving-range hero was most recently changed from a split text/image layout to a full-screen background image, matching the homepage, coaching and juniors pages. Its copy, operating facts and CTAs are centred over a subtle dark gradient.

## 9. Current booking and portal limitations

The booking flow is intentionally a UI prototype. It currently:

- Selects a service
- Selects Durbanville or Hazendal
- Filters coaches by location
- Selects a hard-coded date and time
- Shows a frontend completion state
- Accepts initial selections from query parameters

It does **not** currently:

- Fetch live coach availability
- Persist reservations
- Collect customer details
- Take payment or deposits
- Send confirmations
- Create calendar events
- Connect to a customer account
- Handle cancellations/rescheduling

The portal is also a static interface preview. Its form does not authenticate or submit to a server.

## 10. Remaining work, prioritised

### Priority 1 — Content and business verification

- Confirm every displayed price, package condition, lesson duration, opening hour, date and programme rule with Pure Motion Golf.
- Confirm 2026/2027 date references before launch.
- Confirm all coach names, roles, biographies, availability and location assignments.
- Confirm Durbanville/Hazendal addresses and Google Maps destinations.
- Confirm social links, WhatsApp number, review link and external results links.
- Decide whether legal pages should remain on the existing website or be rebuilt locally.

### Priority 2 — Real booking system

- Choose the source of truth for services, coaches, locations, availability and pricing.
- Connect a booking/calendar provider or build the required backend.
- Replace hard-coded dates/times in `components/booking-flow.tsx`.
- Add customer details, validation, confirmation and error states.
- Add deposits/payments if required.
- Add confirmation emails/WhatsApp messages if required.
- Define cancellation, refund and rescheduling workflows.

### Priority 3 — Customer portal/authentication

- Choose authentication and account infrastructure.
- Implement secure sign-in, forgotten-password and session handling.
- Build lesson history, upcoming bookings, package balances, payments and profile management.
- Connect portal data to the booking system.

### Priority 4 — Forms and live integrations

- Decide whether contact should remain WhatsApp/phone based or include a real form.
- Confirm the embedded Google Calendar account and public visibility.
- Add spam protection and server-side validation to any future forms.
- Add analytics and conversion tracking with approved consent behaviour.
- Add a production cookie/consent solution if legally required.

### Priority 5 — QA, accessibility and performance

- Complete manual QA in Chrome, Safari, Firefox and Edge.
- Test iPhone, Android, iPad/tablet and common desktop widths.
- Test keyboard navigation through all mega menus, mobile menus and section bars.
- Test screen-reader labels and heading order.
- Test reduced-motion mode.
- Confirm text contrast over every hero image crop.
- Run Lighthouse and optimise any remaining image/font/layout-shift issues.
- Add automated smoke/E2E tests for navigation, anchor jumps, menu closing and booking steps.
- Consider splitting the large `app/globals.css` into maintainable page/component styles once the design stabilises.

### Priority 6 — Deployment and operations

- Put the project under Git source control.
- Configure the production `NEXT_PUBLIC_SITE_URL`.
- Select and configure hosting (for example Vercel).
- Confirm domain/DNS and canonical URL behaviour.
- Add environment-variable management for future integrations.
- Set up preview deployments and a production release checklist.
- Add error monitoring and uptime monitoring.

## 11. Known constraints and watch-outs

- The site content is hard-coded. A CMS is not currently part of the architecture.
- There are no unit or E2E tests yet.
- `app/globals.css` is large and contains the full site design system and page styles. Make carefully scoped edits and check later media-query overrides.
- The main header is highly stateful. Changes to hover, focus, scroll or route logic must be tested together.
- Never allow CSS hover/focus selectors and React state to compete over dropdown visibility.
- The sticky section navigation depends on real section IDs and DOM order. When adding/removing links, keep the link list and matching section IDs aligned.
- Anchor destinations require scroll offset for both the 78px header and the 76px section navigation.
- Keep new photos in WebP and use `next/image` with accurate `sizes`.
- External legal/social/calendar/result destinations should be rechecked immediately before production launch.

## 12. Verification state at this handoff

Most recent checks:

- `npm run build`: passes
- `npm run typecheck`: passes
- `npm run lint`: passes
- Driving-range full-background hero visually verified at desktop viewport
- Header menu verified closed after navigation and after scrolling

Recommended first command in a new session:

```bash
cd "/Users/tjwillemse/Desktop/Pure Motion Golf/development/fe" && npm run lint && npm run typecheck && npm run build
```

## 13. Suggested next implementation sequence

1. Run all quality checks and perform a quick visual pass of every route.
2. Finalise and approve all business content, rates, dates and coach data.
3. Decide the booking/calendar/payment architecture.
4. Implement the real booking workflow.
5. Implement authentication and the customer portal.
6. Complete cross-browser, mobile, accessibility and performance QA.
7. Add tests, source control, preview deployment and production monitoring.
8. Launch only after stakeholder content approval and real booking-path testing.

## 14. Copy/paste prompt for a new chat

```text
Continue the Pure Motion Golf Academy redesign in:
/Users/tjwillemse/Desktop/Pure Motion Golf/development/fe

First read PROJECT_HANDOFF.md and AGENTS.md completely. Then inspect the current implementation before changing anything. Preserve the established premium editorial design, WebP-only raster image rule, transparent-to-solid sticky header behaviour, strict dropdown closing behaviour, sticky section navigation, and scroll-linked orange section progress. Do not reconnect CSS :hover/:focus-within directly to dropdown visibility; React activeMenu state is authoritative.

Run npm run lint, npm run typecheck and npm run build before handing work back. The booking flow and portal are currently frontend previews, not real systems. Clearly distinguish completed frontend work from missing backend/integration work.

My next request is: [INSERT REQUEST HERE]
```
