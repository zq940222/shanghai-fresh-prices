# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start Next.js dev server
npm run build        # production build (also type-checks)
npm run lint         # ESLint
npm run test         # Vitest in watch mode
npm run test:run     # Vitest single run (CI)

# Run a single test file
npx vitest run __tests__/api/prices.test.ts

# Database
npx prisma migrate dev       # apply migrations + regenerate client
npx prisma migrate deploy    # apply migrations (production)
npx prisma generate          # regenerate client after schema change
npx prisma db seed           # seed reference data
npx prisma studio            # GUI browser for the DB
```

Environment variables are in `.env`. Required: `DATABASE_URL`. Optional: `SCRAPER_TARGET_URL` (unused — scraper now fetches from cif.mofcom.gov.cn directly), `CRON_SCHEDULE` (default `0 6 * * *`).

## Architecture

**Stack**: Next.js 16 App Router · PostgreSQL · Prisma v7 · Tailwind CSS v4 · Recharts · Vitest

### Data model

Five tables: `Product`, `District`, `Origin`, `QualityGrade`, `Price`, `ScraperLog`.  
`Price` has a composite unique key `(productId, districtId, originId, qualityId, priceDate)` — all upserts must use this key.  
Reference data (products, districts, origins, quality grades) is pre-populated via `prisma/seed.ts`.

### API routes (`app/api/`)

| Route | Purpose |
|---|---|
| `GET/POST /api/prices` | List prices (filters via query params) or create/upsert one |
| `GET /api/prices/trend` | Time-series averages by product name + day window |
| `GET /api/prices/stats` | Aggregate counts for dashboard cards |
| `GET /api/products`, `/districts`, `/origins`, `/quality-grades` | Reference data for form dropdowns |
| `POST /api/scraper/run` | Trigger manual scrape; rate-limited to once per 5 minutes via ScraperLog |
| `GET /api/scraper/logs` | Last 20 scraper run logs |

All route handlers use `new URL(req.url).searchParams` — **not** `req.nextUrl.searchParams` (the latter breaks in Vitest).

### Scraper (`lib/scraper.ts` + `lib/cron.ts`)

Fetches wholesale prices from **商务部 cif.mofcom.gov.cn** for 12 product types (7 vegetables, pork loin, beef, lamb, whole chicken, eggs). Each commodity has a fixed `commdityid` URL parameter. The site reports prices in yuan/公斤; the scraper divides by 2 to store as yuan/斤. Retail price is estimated as `wholesalePrice × 1.35` (the source has no retail data). Requests are spaced 600 ms apart. Only rows where 地区 contains "上海" are kept. Market names are mapped to district names via keyword matching in `MARKET_DISTRICT`.

`lib/cron.ts` wraps the scraper into a job that upserts products, districts, and prices. It always uses origin `本地` and quality `统货` for scraper-sourced records.

### Prisma v7 — critical differences

- **No library/binary engine.** Prisma v7 uses a WASM-based client engine that requires a database adapter. Always construct `PrismaClient` with `adapter: new PrismaPg(...)`.
- **`prisma.config.ts`** holds the datasource URL — the `datasource` block in `schema.prisma` has **no `url` field**.
- After any schema change: `npx prisma migrate dev` then `npx prisma generate`.

### Frontend pages

- `/` — price list with client-side filtering (`FilterPanel` → `PriceTable`); data loaded once from `/api/prices`
- `/trends` — line chart (`TrendChart` via Recharts) querying `/api/prices/trend?name=...&days=30`
- `/admin` — dashboard with stats, scraper trigger button (`ScraperButton`), and links to price management
- `/admin/prices` — CRUD table (`DataTable`); `/admin/prices/new` and `/admin/prices/[id]/edit` use `PriceForm`

### Testing

Tests live in `__tests__/` mirroring the source tree. API route tests mock `@/lib/prisma` with `vi.mock`. Component tests use `@testing-library/react` with jsdom. The scraper test (`__tests__/lib/scraper.test.ts`) makes real HTTP requests and matches the current `ScrapedPrice` shape (`wholesalePrice`, `retailPrice`, `district` — **not** the old `price`/`market` fields).
