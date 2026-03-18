import type { ClosedTrade, LeagueConfig, TraderProfile } from "./types";

export const defaultLeagueConfig: LeagueConfig = {
  minEligibleNotionalUsd: 500,
  maxTradesCountedPerMarket: 3,
  maxScorePerTrade: 140,
  positivePnlMultiplier: 1.25,
  consistencyWeight: 18,
  questBonusWeight: 9,
  streakBonusWeight: 7,
  liquidationPenalty: 90,
  washTradePenalty: 60,
  leveragePenaltyThreshold: 20,
  leveragePenaltyWeight: 5
};

export const competitionMeta = {
  name: "Adrena Sprint Leagues",
  format: "72-hour division-based competition",
  goal: "Reward real trading skill and retention instead of raw whale volume or one-shot gamble trades.",
  integrationTargets: ["Leaderboard", "Mutagen", "Quests", "Streaks", "Raffles"]
};

export const traderProfiles: TraderProfile[] = [
  {
    id: "t1",
    handle: "basis.bandit",
    division: "Pro",
    rolling30dVolume: 920_000,
    winRate: 0.61,
    questCompletions: 5,
    streakDays: 6,
    liquidations: 0,
    referralInfluence: 14
  },
  {
    id: "t2",
    handle: "gamma.girl",
    division: "Pro",
    rolling30dVolume: 1_450_000,
    winRate: 0.53,
    questCompletions: 3,
    streakDays: 4,
    liquidations: 1,
    referralInfluence: 18
  },
  {
    id: "t3",
    handle: "orbital.otto",
    division: "Challenger",
    rolling30dVolume: 210_000,
    winRate: 0.66,
    questCompletions: 7,
    streakDays: 8,
    liquidations: 0,
    referralInfluence: 8
  },
  {
    id: "t4",
    handle: "degen.delta",
    division: "Challenger",
    rolling30dVolume: 410_000,
    winRate: 0.48,
    questCompletions: 2,
    streakDays: 2,
    liquidations: 2,
    referralInfluence: 20
  },
  {
    id: "t5",
    handle: "quiet.quants",
    division: "Rookie",
    rolling30dVolume: 74_000,
    winRate: 0.63,
    questCompletions: 6,
    streakDays: 5,
    liquidations: 0,
    referralInfluence: 5
  },
  {
    id: "t6",
    handle: "micro.mercury",
    division: "Rookie",
    rolling30dVolume: 61_000,
    winRate: 0.58,
    questCompletions: 8,
    streakDays: 9,
    liquidations: 0,
    referralInfluence: 4
  }
];

export const closedTrades: ClosedTrade[] = [
  {
    id: "c1",
    traderId: "t1",
    market: "SOL-PERP",
    side: "long",
    notionalUsd: 82_000,
    pnlUsd: 2_240,
    feesUsd: 135,
    fundingUsd: -40,
    durationMinutes: 290,
    leverage: 6,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T03:30:00Z"
  },
  {
    id: "c2",
    traderId: "t1",
    market: "BTC-PERP",
    side: "short",
    notionalUsd: 55_000,
    pnlUsd: 1_190,
    feesUsd: 120,
    fundingUsd: 80,
    durationMinutes: 425,
    leverage: 4,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T12:30:00Z"
  },
  {
    id: "c3",
    traderId: "t2",
    market: "SOL-PERP",
    side: "long",
    notionalUsd: 110_000,
    pnlUsd: 3_320,
    feesUsd: 190,
    fundingUsd: -95,
    durationMinutes: 90,
    leverage: 18,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T09:10:00Z"
  },
  {
    id: "c4",
    traderId: "t2",
    market: "BTC-PERP",
    side: "short",
    notionalUsd: 96_000,
    pnlUsd: -1_420,
    feesUsd: 175,
    fundingUsd: 25,
    durationMinutes: 54,
    leverage: 22,
    isLiquidation: true,
    isWashLike: false,
    timestamp: "2026-03-17T14:40:00Z"
  },
  {
    id: "c5",
    traderId: "t3",
    market: "ETH-PERP",
    side: "long",
    notionalUsd: 42_000,
    pnlUsd: 1_280,
    feesUsd: 78,
    fundingUsd: -15,
    durationMinutes: 380,
    leverage: 5,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T04:20:00Z"
  },
  {
    id: "c6",
    traderId: "t3",
    market: "SOL-PERP",
    side: "short",
    notionalUsd: 37_000,
    pnlUsd: 860,
    feesUsd: 70,
    fundingUsd: 30,
    durationMinutes: 210,
    leverage: 7,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T21:15:00Z"
  },
  {
    id: "c7",
    traderId: "t4",
    market: "SOL-PERP",
    side: "long",
    notionalUsd: 18_500,
    pnlUsd: 910,
    feesUsd: 42,
    fundingUsd: -10,
    durationMinutes: 16,
    leverage: 30,
    isLiquidation: false,
    isWashLike: true,
    timestamp: "2026-03-17T01:40:00Z"
  },
  {
    id: "c8",
    traderId: "t4",
    market: "SOL-PERP",
    side: "short",
    notionalUsd: 18_000,
    pnlUsd: 780,
    feesUsd: 44,
    fundingUsd: 8,
    durationMinutes: 12,
    leverage: 30,
    isLiquidation: false,
    isWashLike: true,
    timestamp: "2026-03-17T02:10:00Z"
  },
  {
    id: "c9",
    traderId: "t4",
    market: "SOL-PERP",
    side: "long",
    notionalUsd: 17_900,
    pnlUsd: -650,
    feesUsd: 43,
    fundingUsd: -8,
    durationMinutes: 11,
    leverage: 32,
    isLiquidation: true,
    isWashLike: true,
    timestamp: "2026-03-17T02:35:00Z"
  },
  {
    id: "c10",
    traderId: "t5",
    market: "SOL-PERP",
    side: "short",
    notionalUsd: 9_500,
    pnlUsd: 255,
    feesUsd: 15,
    fundingUsd: 4,
    durationMinutes: 300,
    leverage: 4,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T06:20:00Z"
  },
  {
    id: "c11",
    traderId: "t5",
    market: "BTC-PERP",
    side: "long",
    notionalUsd: 12_800,
    pnlUsd: 390,
    feesUsd: 22,
    fundingUsd: -7,
    durationMinutes: 460,
    leverage: 3,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T15:50:00Z"
  },
  {
    id: "c12",
    traderId: "t6",
    market: "ETH-PERP",
    side: "short",
    notionalUsd: 6_600,
    pnlUsd: 180,
    feesUsd: 11,
    fundingUsd: 5,
    durationMinutes: 220,
    leverage: 4,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T05:10:00Z"
  },
  {
    id: "c13",
    traderId: "t6",
    market: "SOL-PERP",
    side: "long",
    notionalUsd: 7_100,
    pnlUsd: 202,
    feesUsd: 12,
    fundingUsd: -3,
    durationMinutes: 170,
    leverage: 4,
    isLiquidation: false,
    isWashLike: false,
    timestamp: "2026-03-17T18:30:00Z"
  }
];

export const comparisonMetrics = [
  {
    label: "Pure PnL",
    summary: "Fast to understand, but whale-friendly and highly swingy.",
    weakness: "Promotes all-in risk taking and late leaderboard sniping."
  },
  {
    label: "Raw Volume",
    summary: "Boosts activity, but rewards churn and wash-like behaviour.",
    weakness: "Weak signal for actual trading skill or healthy retention."
  },
  {
    label: "Sprint Leagues",
    summary: "Balances realized performance, consistency, and quest engagement.",
    weakness: "Needs a scoring service and abuse controls, both included here."
  }
];

export const pilotFeedbackPrompts = [
  "Did the scoring feel fair across wallet sizes?",
  "Did penalties make liquidation avoidance feel strategically important?",
  "Did the division system make the competition feel more winnable?",
  "Would you trade more often during a 72-hour sprint than a month-long season?",
  "Which reward mattered most: cash prize, streak boost, or raffle entries?"
];
