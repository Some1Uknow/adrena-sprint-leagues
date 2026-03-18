# Adrena Sprint Leagues Final Submission Prototype

`Sprint Leagues` is a competition module proposal for Adrena that upgrades the standard perp DEX leaderboard into a repeatable `72-hour` league format. The core pitch is simple: keep the excitement that already drives Adrena volume, but make the game feel more fair, more readable, and harder to exploit.

This prototype is designed around five advantages:

- realized trading performance
- consistency over a short sprint window
- division-based matchmaking
- quest and streak integration
- explicit abuse prevention

This repository is structured as a judged prototype, not a production-ready Adrena fork. The goal is to show a competition system Adrena could realistically ship without redesigning its trading stack.

## What is included

- Interactive competition prototype with self-test scenarios
- Scoring engine with anti-abuse penalties
- Division-based ranking snapshots
- Architecture notes for Adrena integration
- Typed public API helpers for Adrena's published trading surface
- Strategy and product design documentation
- Unit tests for the scoring engine

## Core idea

Most perp competitions fail in one of two ways:

1. Pure PnL makes the format whale-heavy and rewards reckless sniping.
2. Pure volume rewards churn and weakens the signal of actual skill.

Sprint Leagues introduces short competitions where traders are matched by division and scored on closed-trade quality, quest participation, and streak consistency, with hard penalties for liquidations and wash-like behavior. The result is a competition loop that is easier to replay weekly, easier to market, and easier for normal traders to believe they can win.

## Local development

```bash
npm install
npm run dev
```

Build and test:

```bash
npm run build
npm run test
```

## Files

- `src/App.tsx` - prototype UI
- `src/lib/scoring.ts` - competition scoring engine
- `src/lib/scoring.test.ts` - unit tests
- `src/lib/adrenaApi.ts` - typed helpers for confirmed Adrena public endpoints
- `docs/competition-design.md` - submission design document
- `docs/testing-guide.md` - solo testing checklist and pilot notes
- `docs/integration-plan.md` - what is public vs. assumed in Adrena integration
- `docs/final-submission.md` - exact submission structure

## Suggested demo flow

1. Show the hero and explain why current perp competitions are weak.
2. Use the scenario lab to test whale sniping, wash-trading, and stricter enforcement.
3. Walk through the division boards and compare clean traders vs. abusive patterns.
4. Show the trader journey and operator journey sections.
5. End on the Adrena API integration cards and the pilot/testing plan.

## Submission package

Use these files directly in the bounty submission:

- `docs/competition-design.md`
- `docs/integration-plan.md`
- `docs/testing-guide.md`
- `docs/pilot-runbook.md`
- `docs/final-submission.md`
- repository link or archive with the working app and scoring engine

## Judge takeaway

If a reviewer only remembers one thing, it should be this:

`Sprint Leagues is not a brand-new game. It is a stronger competition layer on top of Adrena's existing loop.`
