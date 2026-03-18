# Integration Plan

## Integration thesis

Sprint Leagues should not replace Adrena's trading flow. It should plug into it.

That is what makes this proposal realistic. The competition layer can be improved without asking Adrena to redesign execution, wallet flow, or protocol infrastructure.

## What is publicly confirmed

The shared Adrena Postman documentation confirms a public API base URL:

`https://datapi.adrena.trade`

Confirmed documented patterns:

- request a quote
- receive a prepared serialized transaction
- caller signs and submits on-chain

Confirmed endpoint categories in the public documentation:

- trading
- positions
- pool info
- liquidity
- APR

Confirmed endpoints directly reviewed for this prototype:

- `GET /add-liquidity`
- `GET /remove-liquidity`
- `GET /open-long`

## What this means for Sprint Leagues

Sprint Leagues can sit above the existing execution flow:

1. trader requests a quote through Adrena
2. trader signs and submits the returned transaction
3. executed trade is indexed by Adrena infrastructure
4. competition service consumes the resulting trade data
5. leaderboard and reward state are updated

This is the core architectural argument of the submission:

`the competition module is an off-chain scoring and reward layer, not a new trading protocol.`

## Public vs private boundary

### Publicly confirmed

- transaction preparation flow exists
- wallet-first execution model exists
- trading and liquidity actions already have HTTP surfaces

### Not publicly confirmed

- competition leaderboard write APIs
- quest, streak, or raffle programmatic hooks
- historical trade feed for competition scoring
- admin APIs for launching competitions

## Recommended adapter boundaries

To keep the implementation credible, the system is separated into explicit boundaries:

- `AdrenaTradeAdapter`
  Uses public trading surfaces now and can absorb future internal execution hooks later.

- `CompetitionScoringService`
  Calculates rank, penalties, and reward state off-chain.

- `LeaderboardAdapter`
  Publishes standings snapshots into Adrena's leaderboard surface.

- `RewardAdapter`
  Maps results into quests, streaks, and raffle entries.

This separation matters for judging because it shows exactly what is built, exactly what is assumed, and exactly where Adrena-owned systems would connect.

## Why this is still a valid implementation

The bounty asks for:

- a new competition module or meaningful improvement
- functional code that can be reviewed and tested
- coordination with Adrena for integration requirements

Discord access was unavailable and public documentation was limited to the shared Postman collection. This submission therefore does the responsible thing:

- it uses the confirmed public execution model
- it implements the competition logic and prototype UI directly
- it documents the internal adapter boundaries instead of pretending private sponsor APIs were available

That keeps the submission honest while still showing a credible path to production.
