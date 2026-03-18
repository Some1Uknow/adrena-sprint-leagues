import type {
  ClosedTrade,
  LeagueConfig,
  TraderProfile,
  TraderScoreBreakdown
} from "../types";

const round = (value: number) => Math.round(value * 100) / 100;

const netPnl = (trade: ClosedTrade) =>
  trade.pnlUsd - trade.feesUsd + trade.fundingUsd;

const durationMultiplier = (durationMinutes: number) => {
  if (durationMinutes >= 360) {
    return 1.16;
  }

  if (durationMinutes >= 180) {
    return 1.08;
  }

  if (durationMinutes >= 60) {
    return 1;
  }

  return 0.88;
};

const leveragePenalty = (trade: ClosedTrade, config: LeagueConfig) => {
  if (trade.leverage <= config.leveragePenaltyThreshold) {
    return 0;
  }

  return (trade.leverage - config.leveragePenaltyThreshold) * config.leveragePenaltyWeight;
};

const scoreTrade = (trade: ClosedTrade, config: LeagueConfig) => {
  if (trade.notionalUsd < config.minEligibleNotionalUsd) {
    return 0;
  }

  const realized = netPnl(trade);
  const pnlRatio = realized / trade.notionalUsd;
  const pnlScore =
    realized > 0
      ? pnlRatio * 1000 * config.positivePnlMultiplier
      : pnlRatio * 1000;
  const sizeScore = Math.sqrt(trade.notionalUsd / config.minEligibleNotionalUsd) * 10;
  const grossScore =
    (pnlScore + sizeScore + config.consistencyWeight) *
    durationMultiplier(trade.durationMinutes);
  const clamped = Math.min(grossScore, config.maxScorePerTrade);
  const penalties =
    (trade.isLiquidation ? config.liquidationPenalty : 0) +
    (trade.isWashLike ? config.washTradePenalty : 0) +
    leveragePenalty(trade, config);

  return round(clamped - penalties);
};

export const scoreCompetition = (
  traders: TraderProfile[],
  trades: ClosedTrade[],
  config: LeagueConfig
): TraderScoreBreakdown[] => {
  const traderMap = new Map(traders.map((trader) => [trader.id, trader]));

  return traders
    .map((trader) => {
      const traderTrades = trades
        .filter((trade) => trade.traderId === trader.id)
        .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
      const marketCounts = new Map<string, number>();
      let totalScore = 0;
      let adjustedPnlUsd = 0;
      let eligibleVolumeUsd = 0;
      let countedTrades = 0;
      let washPenalty = 0;
      let liquidationPenalty = 0;
      const flags = new Set<string>();

      for (const trade of traderTrades) {
        const currentCount = marketCounts.get(trade.market) ?? 0;
        if (currentCount >= config.maxTradesCountedPerMarket) {
          flags.add(`volume cap reached on ${trade.market}`);
          continue;
        }

        const tradeScore = scoreTrade(trade, config);
        marketCounts.set(trade.market, currentCount + 1);

        if (trade.notionalUsd >= config.minEligibleNotionalUsd) {
          countedTrades += 1;
          eligibleVolumeUsd += trade.notionalUsd;
          adjustedPnlUsd += netPnl(trade);
        }

        if (trade.isWashLike) {
          washPenalty += config.washTradePenalty;
          flags.add("wash-like cadence flagged");
        }

        if (trade.isLiquidation) {
          liquidationPenalty += config.liquidationPenalty;
          flags.add("liquidation penalty applied");
        }

        if (trade.leverage > config.leveragePenaltyThreshold) {
          flags.add("high leverage haircut");
        }

        totalScore += tradeScore;
      }

      const questBonus = trader.questCompletions * config.questBonusWeight;
      const streakBonus = trader.streakDays * config.streakBonusWeight;
      totalScore += questBonus + streakBonus;

      return {
        trader: traderMap.get(trader.id)!,
        totalScore: round(totalScore),
        adjustedPnlUsd: round(adjustedPnlUsd),
        eligibleVolumeUsd,
        countedTrades,
        questBonus,
        streakBonus,
        liquidationPenalty,
        washPenalty,
        flags: Array.from(flags)
      };
    })
    .sort((left, right) => right.totalScore - left.totalScore);
};

export const scoreByDivision = (
  traders: TraderProfile[],
  trades: ClosedTrade[],
  config: LeagueConfig
) => {
  const divisionBuckets = new Map<string, TraderScoreBreakdown[]>();

  for (const result of scoreCompetition(traders, trades, config)) {
    const bucket = divisionBuckets.get(result.trader.division) ?? [];
    bucket.push(result);
    divisionBuckets.set(result.trader.division, bucket);
  }

  return divisionBuckets;
};
