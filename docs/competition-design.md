# Competition Design Document

## Name

Adrena Sprint Leagues

## Executive summary

Adrena has already proven that competitions are a major growth loop. The opportunity is not to invent a completely different mode. The opportunity is to make that loop more fair, more replayable, and more defensible than the standard perp DEX formula.

`Sprint Leagues` is a short-form competition layer built on top of Adrena's existing trading and reward systems. It replaces one large whale-dominated race with repeatable `72-hour` division-based sprints where realized performance, consistency, and platform engagement all matter.

In one sentence:

`Sprint Leagues makes Adrena competitions feel more winnable for normal traders without making them easier to game.`

## The problem to solve

Most perp competitions break in one of three ways:

- Pure PnL leaderboards reward late-stage all-in behavior.
- Pure volume races reward churn and wash-like patterns.
- Long seasons feel unwinnable for smaller or newer traders.

That creates the wrong product outcome. The competition may drive activity, but it does not always drive healthy activity, believable fairness, or repeat participation.

## Proposed format

Sprint Leagues are short, repeatable competitions, ideally `72 hours` or `7 days`, where traders opt into a league and compete inside a division.

Divisions:

- Rookie
- Challenger
- Pro

Traders are assigned using recent activity signals such as rolling volume, consistency, and historical behavior. The point is to prevent first-week users from being dropped into the same race as the platform's largest established traders.

This changes the emotional shape of the event:

- each trader sees a winnable bracket
- each sprint has a clear beginning, midpoint, and close
- Adrena gets a format it can run repeatedly without the event feeling stale

## Scoring mechanics

Only closed trades count toward standings.

Each eligible trade contributes score based on:

- realized net PnL after fees and funding
- trade duration
- notional size
- leverage profile

The model includes:

- minimum notional threshold
- cap on counted trades per market
- cap on maximum score contribution per trade
- liquidation penalty
- wash-like cadence penalty
- leverage haircut above a configurable threshold

Trader-level bonuses:

- quest completion bonus
- streak bonus

This is important for product fit. Sprint Leagues should feel like a stronger version of Adrena's current competition loop, not a detached side mode with its own isolated reward logic.

## Why this format is stronger

Compared with pure PnL:

- it reduces late leaderboard sniping
- it gives consistency and risk control more weight
- it produces a more believable winner

Compared with pure volume:

- it tracks trader quality more closely
- it is harder to farm through repetitive low-signal flow
- it gives abuse controls a natural place in the ranking model

Compared with long seasonal ladders:

- it feels more winnable
- it is easier to explain in one screen
- it is easier to market as a recurring event
- it creates more reasons to come back next week

## Reward structure

The format supports both direct rewards and ecosystem-aligned incentives:

- prize money or token rewards per division
- Mutagen boosts for top finishers
- raffle ticket multipliers for high-quality participation
- streak preservation or extension for above-median finishes
- quest-linked rewards for side objectives

This matters because Adrena does not have just one user persona. Some traders want podium rewards, some want progression, and some want compounding platform benefits.

## Fit with existing Adrena systems

### Leaderboard

League standings are generated off-chain from closed-trade data and exposed through a competition leaderboard surface.

### Quests

Competition-specific quests can layer on top of existing quest primitives:

- trade across two markets
- finish the sprint with no liquidation
- close three profitable trades during the event

### Streaks

League participation or above-median placement can extend streaks.

### Raffles

Every sprint can mint raffle entries based on participation quality instead of raw volume alone.

## Edge cases and abuse prevention

- ignore trades below a configurable minimum notional
- count only closed trades
- cap repeated contributions per market
- penalize liquidations hard
- penalize flagged wash-like cadence
- apply leverage haircut above threshold
- freeze or shadow-review flagged wallets pending manual review
- use sybil heuristics on wallet clusters, timing, and mirrored behavior

The key principle is simple: abusive behavior should still be visible, but it should not look competitive.

## Technical implementation

Recommended architecture:

1. Ingest Adrena closed-trade events from the existing indexer.
2. Normalize events in an off-chain competition service.
3. Compute trader scores and abuse flags.
4. Store standings snapshots and reward state.
5. Expose leaderboard and admin controls through internal APIs.

Why off-chain first:

- faster to ship
- easier to tune scoring safely
- lower operational risk
- simpler abuse response

No new Solana program is required for the first version.

## Production viability

Sprint Leagues is intentionally designed to be operationally realistic:

- deterministic off-chain scoring
- no custody changes
- no protocol-level migration
- can launch to a subset of users first
- can run as a recurring campaign engine

## MVP scope

- admin-configurable competition
- score engine
- per-division leaderboard
- abuse flagging
- reward mapping
- frontend integration endpoints

## Why this should win

This proposal is strong for Adrena because it is not just a prettier leaderboard. It is a meaningful infrastructure improvement:

- better fairness than pure PnL
- better signal than pure volume
- better replayability than long ladders
- clean integration path with existing quests, streaks, and raffles
- deployable as an off-chain module first

## Future iterations

- team leagues
- sponsor-backed modifiers
- invite-only high-signal tournaments
- achievement-based cosmetic progression
- social watchlists and rivalries
