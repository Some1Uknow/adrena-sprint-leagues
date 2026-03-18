# Adrena Sprint Leagues

`Sprint Leagues` is a competition layer for Adrena that upgrades the standard perp DEX leaderboard into a repeatable `72-hour` league format. The core idea is simple: keep the excitement that already drives Adrena volume, but make the game feel more fair, more readable, and harder to exploit.

Sprint Leagues is designed around five advantages:

- realized trading performance
- consistency over a short sprint window
- division-based matchmaking
- quest and streak integration
- explicit abuse prevention

This repository presents Sprint Leagues as a product system Adrena could ship without redesigning its trading stack.

## What is included

- Interactive competition app with self-test scenarios
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

- `src/App.tsx` - main app experience
- `src/lib/scoring.ts` - competition scoring engine
- `src/lib/scoring.test.ts` - unit tests
- `src/lib/adrenaApi.ts` - typed helpers for confirmed Adrena public endpoints
- `docs/competition-design.md` - product and competition design
- `docs/testing-guide.md` - solo testing checklist and pilot notes
- `docs/integration-plan.md` - what is public vs. assumed in Adrena integration
- `docs/final-submission.md` - concise project summary and positioning
