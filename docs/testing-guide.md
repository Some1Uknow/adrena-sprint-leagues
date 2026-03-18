# Testing Guide

## Goal

Validate that Sprint Leagues behaves like a better competition system than a plain PnL or plain volume leaderboard.

This guide is designed for solo testing, which is appropriate for the current prototype because the scoring engine, scenario lab, and UI are deterministic.

## Local run

```bash
npm install
npm run dev
```

Optional verification:

```bash
npm run build
npm run test
```

## Solo test flow

Run the following scenarios from the in-app `Run the submission under pressure` section.

### 1. Baseline

Verify:

- clean traders rank above abusive traders
- each division has a readable winner
- quest and streak bonuses visibly affect outcomes

Expected result:

- `orbital.otto`, `basis.bandit`, and the two rookies look competitive
- `degen.delta` remains visibly penalized

### 2. Whale snipe

Verify:

- one oversized profitable trade does not trivialize the sprint
- the score cap feels more fair than pure PnL

Expected result:

- the whale trader improves, but the board does not become obviously broken

### 3. Wash attack

Verify:

- extra churn creates more volume but not a strong rank
- flags stay visible and understandable

Expected result:

- the abusive account remains low quality and clearly risky

### 4. Strict mode

Verify:

- stronger penalties create sharper separation
- operators can tune the format without redesigning the product

Expected result:

- risky behavior falls further behind

## What to record for the submission

Take notes on:

- which scenario feels most convincing
- whether rank changes feel intuitive
- whether the fairness story is clear on first use
- which screens are strongest for screenshots

Recommended screenshots:

- baseline division boards
- wash attack scenario
- trader journey and operator journey
- abuse prevention and integration section

## Suggested testing statement

If you are testing solo, use language like this:

`A structured solo test was run against multiple simulated competition conditions to verify fairness, abuse handling, and readability of the format. The next step is a small closed pilot using live Adrena trade flows.`
