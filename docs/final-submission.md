# Final Submission Package

## Submission title

Adrena Sprint Leagues

## One-line pitch

A division-based competition layer for Adrena that turns whale-heavy PnL races into repeatable 72-hour sprints with anti-abuse scoring, quest/streak integration, and cleaner replayability.

## Short submission summary

Adrena already has the demand side of the competition business. Sprint Leagues is a better operating system for that demand.

Instead of one large leaderboard that favors whales or churn, Sprint Leagues creates short division-based competitions where realized performance, consistency, and platform engagement all matter. It is designed to integrate with Adrena's existing leaderboard, quests, streaks, and raffles while remaining realistic to ship as an off-chain module first.

## What to submit

### 1. Design document

Use:

- `docs/competition-design.md`
- `docs/integration-plan.md`

### 2. Working prototype

Use:

- live app from `src/App.tsx`
- scoring engine in `src/lib/scoring.ts`
- public API helpers in `src/lib/adrenaApi.ts`

### 3. Testing and feedback

Use:

- `docs/testing-guide.md`
- `docs/pilot-runbook.md`

### 4. Deployment instructions

Use:

- `README.md`

## Suggested description for the submission form

Sprint Leagues is a new competition module for Adrena that upgrades the standard perp leaderboard into a repeatable `72-hour` league format. Traders compete inside Rookie, Challenger, and Pro divisions, and standings are based on closed-trade quality, quest participation, streak bonuses, and anti-abuse penalties.

The goal is to make competitions more engaging and more fair without replacing Adrena's existing execution flow. This submission includes a functional prototype, a scoring engine, public API-grounded integration notes, and a structured solo testing package showing how the format behaves under baseline, whale-snipe, wash-attack, and strict-mode scenarios.

## Final checklist

- repository is accessible and code is reviewable
- app runs with `npm install` and `npm run dev`
- `npm run build` passes
- `npm run test` passes
- design document is included
- integration assumptions are documented clearly
- solo testing notes are included honestly

## Optional live walkthrough structure

### 0:00 - 0:20

Problem:

- current perp competitions skew toward whales or churn
- Adrena already has the right primitives but needs a stronger competition format

### 0:20 - 0:55

Show Sprint Leagues:

- 72-hour sprint
- rookie/challenger/pro divisions
- reward loop through quests, streaks, raffles

### 0:55 - 1:35

Show the board:

- clean traders vs. abusive traders
- readable penalties
- why it is more fair than raw PnL or raw volume

### 1:35 - 2:05

Show the scenario lab:

- whale snipe
- wash attack
- strict mode

### 2:05 - 2:35

Show integration:

- public Adrena API surface
- transaction preparation flow
- internal adapters for leaderboard and rewards

### 2:35 - 3:00

Close:

- this is a realistic improvement to Adrena's existing competition infrastructure
- can launch off-chain first
- can expand into richer league formats later
