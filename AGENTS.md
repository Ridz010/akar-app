<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AKAR — project rules for agents

AKAR (AI-Assisted Community-Based Mangrove Monitoring Platform). Next.js 16 App Router,
`cacheComponents: true`, Tailwind v4, shadcn/ui (`base-nova` on Base UI), Supabase, npm.
Backend: FastAPI in `backend/` (see `backend/README.md`).

## Architecture: feature-based modular monolith

```
src/app/          routes only: (public) (auth) (app) (admin), auth/confirm, api/health; thin pages
src/app/_shell/   authenticated shell composition (auth gate inside <Suspense>)
src/features/<f>/ components/ actions.ts queries.ts schemas.ts types.ts index.ts
src/components/   ui/ (shadcn) · motion/ (React Bits) · illustrations/ (2D SVG scenes) · shared/ · landing/ · layout/
src/lib/          supabase/ (server, client, public, proxy) · auth/ · api/backend.ts · env · format
src/config/       site.ts permissions.ts constants.ts images.ts
src/types/        database.ts (matches supabase/migrations)
src/proxy.ts      refreshes the Supabase session
```

Dependency rules:

- `app/` imports features **only via `index.ts`**, plus `components/`, `lib/`, `config/`.
- `features/A` must not import internal files of `features/B`.
- `components/` and `lib/` must not import from `features/`.
- Database access only in a feature's `queries.ts` / `actions.ts`. Queries return empty results
  when Supabase is not configured (`createClientIfConfigured`, `createPublicClient`).
- Every Server Action validates input with the feature's Zod schema and checks access with
  `requireUser` / `requireRole`. RLS in Postgres is the final guard.
- Calls to FastAPI go through `lib/api/backend.ts` (server only, forwards the user's JWT).
- Navigation per role lives in `config/site.ts` (`appNavFor`): community = dashboard, Pindai AI,
  peta, pusat pengetahuan, laporan, riwayat lokasi, profil; coordinator adds aktivitas
  konservasi; admin adds verifikasi and kelola pengguna. Verification is admin-only
  (`requireRole('admin')`); activity management is coordinator + admin.
- Default to Server Components. `'use client'` only on the smallest interactive leaf.

Next 16 / Cache Components gotchas:

- `new Date()` / `Math.random()` during prerender fail the build (also in Client Components).
  Format dates with `lib/format.ts` (Asia/Jakarta).
- `usePathname()`, `cookies()`, `searchParams`, auth reads must sit inside `<Suspense>`.
- `error.tsx` receives `retry` (not `reset`).

## Code style

- No comments in code (including JSX `{/* */}`). Names and small functions carry the meaning;
  explanations belong in README/docs.
- `cn()` is tailwind-merge: never name a custom utility `text-*`, `bg-*` etc. Typography utilities
  are `type-display` and `type-title` (`globals.css`).
- Build class lists with `cn()`, not template-literal concatenation (Prettier's Tailwind plugin
  trims spaces inside class strings).
- Vendored React Bits files in `components/motion/` keep upstream structure; their React Compiler
  lint rules are relaxed in `eslint.config.mjs`.

## Visual language

- Two fonts: **Changa One** (`font-display`, `type-display`, `type-title`) for headings and highlight
  text (card titles, big numbers, taglines); **Google Sans Flex** for body and UI. Changa One has a
  single weight (400): never add `font-light`/`font-bold` to it. Sentence case, never uppercase.
  Small label headings (`text-sm`) use `font-sans`.
- Logo: mark only (`components/shared/logo.tsx`), never the "AKAR" wordmark next to it.
- Layout: editorial. Large display type, thin `line` rules, photography and 2D illustration. No section numbers
  (`01`, `02`). Cards follow `components/shared/feature-card.tsx` (inset TiltedCard photo, corner
  arrow, overlapping icon, display title, pill action). Avoid gradient placeholders and sparkle icons.
- Hero photos keep the image and add a soft green gradient from the right.
- 2D illustrations live in `components/illustrations/` (`parts.tsx` holds the scene palette and the
  shared cloud, tree, crab and fish shapes). Scenes are decorative (`aria-hidden`), anchored to the
  bottom with `preserveAspectRatio="xMidYMax slice"`, and blend into the next section through
  `floorColor`. Clouds drift with `motion-safe:animate-drift`.
- Dark green sections get `NightForest` (mangrove silhouettes, twinkling fireflies) and/or
  `FallingLeaves`; light sections get `CloudCluster` wrapped in `motion/parallax.tsx` (follows the
  mouse only, off for touch and reduced motion). Decorations are `-z-10` inside an `isolate`
  section and never carry content.
- Landing bento (`landing/feature-bento.tsx`) passes custom `content` to `MagicBento`: photo cards
  with a heading in the top-left or bottom, white stat cards with an icon and a big display value
  taken from config, and a statement card on a `Meadow` strip. No invented numbers.
- Colour: 60% white/surface/paper · 30% sage + ink · 10% lime (CTA).
  Body `text-ink`, secondary `text-slate`; green text ≥ `sage-600`; links `sage-700`.
  One lime button per viewport. Dark sections `bg-sage-900`, footer `bg-sage-950`.
- No "AI colour" and no AI icons. Model output uses the neutral `prediction` tone with the
  `CircleDashed` icon and the label "Prediksi awal". Green means human-verified.
- `water-*` is only for water effects (navbar splash); sky and sea colours in illustrations come from `SCENE`. Status = colour + icon + label
  (`components/shared/status-badge.tsx`).

## Motion

- Use React Bits from `components/motion/`: `Reveal` (wraps `AnimatedContent`) for entrances,
  `SplitText` for headings, `ScrollReveal` for statements, `CountUp`, `Magnet`, `MagicBento`,
  `GooeyNav` (navbar, water-blue splash via `colors`), `TiltedCard` (card photos), `AccordionGallery`
  (photo galleries), `CurvedInput` (email CTA). Raw `<img>` inside these components must receive
  `optimizedImage()` URLs from `lib/image.ts`, never the full-size originals.
- Entrances ≤ 600 ms, play once, and respect `prefers-reduced-motion`. No WebGL backgrounds.

## Content rules

- All UI text in Bahasa Indonesia; code identifiers in English.
- No fake data: no invented statistics, testimonials, people, or partner logos. Show real counts
  from the database or an honest empty state.
- Images: `next/image`, entries in `src/config/images.ts` (alt text in Indonesian, describing
  what is actually in the photo), correct `sizes`, only one `priority` per page.
  Originals live in `public/img/`, pages use resized copies in `public/img/web/` (see
  `docs/asset-map.md`).
  Never modify originals in `public/img` / `public/icon`.

## Verify before finishing

```bash
npm run lint
npm run typecheck   # next typegen && tsc --noEmit
npm test
npm run build
```
