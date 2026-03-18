export type DivisionTier = "Rookie" | "Challenger" | "Pro";

export type TraderProfile = {
  id: string;
  handle: string;
  division: DivisionTier;
  rolling30dVolume: number;
  winRate: number;
  questCompletions: number;
  streakDays: number;
  liquidations: number;
  referralInfluence: number;
};

export type ClosedTrade = {
  id: string;
  traderId: string;
  market: string;
  side: "long" | "short";
  notionalUsd: number;
  pnlUsd: number;
  feesUsd: number;
  fundingUsd: number;
  durationMinutes: number;
  leverage: number;
  isLiquidation: boolean;
  isWashLike: boolean;
  timestamp: string;
};

export type LeagueConfig = {
  minEligibleNotionalUsd: number;
  maxTradesCountedPerMarket: number;
  maxScorePerTrade: number;
  positivePnlMultiplier: number;
  consistencyWeight: number;
  questBonusWeight: number;
  streakBonusWeight: number;
  liquidationPenalty: number;
  washTradePenalty: number;
  leveragePenaltyThreshold: number;
  leveragePenaltyWeight: number;
};

export type TraderScoreBreakdown = {
  trader: TraderProfile;
  totalScore: number;
  adjustedPnlUsd: number;
  eligibleVolumeUsd: number;
  countedTrades: number;
  questBonus: number;
  streakBonus: number;
  liquidationPenalty: number;
  washPenalty: number;
  flags: string[];
};
