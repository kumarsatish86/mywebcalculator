# MyWebCalculator platform roadmap

This document aligns engineering with the management vision: move from **Enter → Calculate → Number** to **Ask → Analyze → Simulate → Compare → Visualize → Export → Save → Share**.

## Stack decision

Keep the current stack for Phase 1–early Phase 2:

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 + Framer Motion + Recharts
- Existing glass UI (not a shadcn rewrite)

Add Postgres, Redis, Meilisearch/Typesense, OpenAI, Auth, and PDF libraries only when a phase below requires them.

## Phase 1 — Discovery + smart results (in progress / shipped foundation)

| Capability | Status |
|------------|--------|
| NL intent search (no LLM) | `lib/search/*`, `GET /api/search` |
| Search-first homepage | `components/home/HomeSearchHero.tsx` |
| Smart Result kit | `components/results/SmartResultPanel.tsx` |
| EMI affordability pilot | `LoanPaymentCalculator` + `loanAffordability.ts` |
| Related tools rail | `RelatedToolsRail` on calculator pages |
| Buying Home journey | `/journeys/buying-home` |
| Explain accordion (SEO-fed) | Pilots: loan-payment, loan-emi, body-bmi |

**Success checks**

1. Homepage: “buy a 60 lakh house” → home/EMI/eligibility suggestions + journey link  
2. `/calculators/loan-payment` with income → Affordable/Risk KPIs + chart + suggestions  
3. `/calculators/body-bmi-calculator` → related diet/TDEE/water tools  
4. `/journeys/buying-home` → ordered stepper  

## Phase 2 — Workspace + Copilot + Reports

- **Auth:** Auth.js or Better Auth + PostgreSQL; optional anonymous local history until login  
- **Dashboard:** `/dashboard` — saved calcs, history, favorites, goals stubs  
- **Saved variables:** salary/city profile → auto-fill  
- **PDF reports:** `@react-pdf/renderer` — summary, inputs, chart snapshot, recommendations, disclaimer, QR, date  
- **AI Copilot:** floating assistant; OpenAI + server orchestration; **tool-call into engines** (numbers must not be free-hallucinated)  
- **Scenario compare UI:** A/B/C panels on salary/EMI  
- **Analytics:** PostHog (search → open → complete → share)

## Phase 3 — Agents, simulation, mobile

- Domain agents (Finance Advisor, Tax Assistant, Cloud Cost, …) as multi-tool flows  
- Full scenario simulator + multi-calculator side-by-side  
- PWA, bottom nav, Web Speech voice input, OCR later  
- Browser extension / public read API  
- Rate/tax change alerts via cron + subscriptions  

## Phase 4 — Platform / monetization

- Public templates, community shares, discussions  
- Creator tools, enterprise white-label, premium subscriptions  
- Meilisearch/Typesense if registry scale needs it  
- Redis for hot intents and report generation  

## Explicit non-goals until later phases

- Live LLM for homepage search (Phase 1 uses deterministic matching)  
- Full community / creator marketplace  
- Voice/OCR/haptics before PWA foundation  
- Migrating the design system to shadcn  

## References in repo

- Intent catalog: `lib/search/intentCatalog.ts`  
- Matcher: `lib/search/matchIntent.ts`  
- Journeys: `lib/journeys/definitions.ts`  
- Recommendations: `lib/recommendations/relatedForSlug.ts`  
