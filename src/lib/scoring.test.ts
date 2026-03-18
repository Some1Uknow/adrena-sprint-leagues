import { describe, expect, it } from "vitest";
import { closedTrades, defaultLeagueConfig, traderProfiles } from "../data";
import { scoreCompetition } from "./scoring";

describe("scoreCompetition", () => {
  it("rewards consistent traders over wash-like high leverage behaviour", () => {
    const leaderboard = scoreCompetition(
      traderProfiles,
      closedTrades,
      defaultLeagueConfig
    );

    const orbitalOtto = leaderboard.find(
      (entry) => entry.trader.handle === "orbital.otto"
    );
    const degenDelta = leaderboard.find(
      (entry) => entry.trader.handle === "degen.delta"
    );

    expect(orbitalOtto).toBeDefined();
    expect(degenDelta).toBeDefined();
    expect(orbitalOtto!.totalScore).toBeGreaterThan(degenDelta!.totalScore);
  });

  it("applies flags when abusive patterns and liquidations occur", () => {
    const leaderboard = scoreCompetition(
      traderProfiles,
      closedTrades,
      defaultLeagueConfig
    );
    const degenDelta = leaderboard.find(
      (entry) => entry.trader.handle === "degen.delta"
    );

    expect(degenDelta?.flags).toContain("wash-like cadence flagged");
    expect(degenDelta?.flags).toContain("liquidation penalty applied");
  });
});
