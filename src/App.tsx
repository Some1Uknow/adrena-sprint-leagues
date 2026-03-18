import { startTransition, useDeferredValue, useState } from "react";
import {
  closedTrades,
  comparisonMetrics,
  competitionMeta,
  defaultLeagueConfig,
  traderProfiles
} from "./data";
import { scoreByDivision, scoreCompetition } from "./lib/scoring";
import type { ClosedTrade, DivisionTier, LeagueConfig } from "./types";

type ConfigField = keyof LeagueConfig;

const configSliders: Array<{
  key: ConfigField;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  {
    key: "minEligibleNotionalUsd",
    label: "Minimum eligible notional",
    min: 100,
    max: 2500,
    step: 100
  },
  {
    key: "maxTradesCountedPerMarket",
    label: "Counted trades per market",
    min: 1,
    max: 6,
    step: 1
  },
  {
    key: "maxScorePerTrade",
    label: "Maximum score per trade",
    min: 60,
    max: 180,
    step: 10
  },
  {
    key: "liquidationPenalty",
    label: "Liquidation penalty",
    min: 30,
    max: 140,
    step: 5
  },
  {
    key: "washTradePenalty",
    label: "Wash-like penalty",
    min: 20,
    max: 120,
    step: 5
  }
];

const experienceSteps = [
  {
    step: "01",
    title: "Opt into a short sprint",
    description:
      "Traders enter a 72-hour competition instead of grinding through a month-long whale ladder."
  },
  {
    step: "02",
    title: "Compete inside your division",
    description:
      "Rookie, Challenger, and Pro brackets keep the format legible and make the climb feel possible."
  },
  {
    step: "03",
    title: "Win on quality, not churn",
    description:
      "Realized performance, streaks, and quest completion matter; liquidations and spam get punished."
  }
];

const scoringPillars = [
  {
    label: "Realized performance",
    description: "Closed trades only. Fees and funding are included."
  },
  {
    label: "Consistency",
    description: "One reckless trade cannot decide the sprint."
  },
  {
    label: "Engagement",
    description: "Quest and streak bonuses connect the mode to existing habits."
  },
  {
    label: "Enforcement",
    description: "Liquidations, repetitive churn, and high-leverage abuse get haircuts."
  }
];

const rewardLanes = [
  {
    title: "Competitive rewards",
    detail: "Prize money or token rewards for podium finishers in each division."
  },
  {
    title: "Platform rewards",
    detail: "Mutagen boosts, quest multipliers, and raffle weight for strong finishers."
  },
  {
    title: "Retention rewards",
    detail: "Replayability through short seasons that reset without feeling punishing."
  }
];

type ScenarioPreset = {
  id: string;
  label: string;
  headline: string;
  summary: string;
  whatToVerify: string;
  configPatch?: Partial<LeagueConfig>;
  transformTrades?: (trades: ClosedTrade[]) => ClosedTrade[];
};

const scenarioPresets: ScenarioPreset[] = [
  {
    id: "baseline",
    label: "Baseline",
    headline: "Balanced sprint",
    summary:
      "Shows the intended day-one format: divisions, quest/streak bonuses, and readable penalties.",
    whatToVerify:
      "Check that clean, consistent traders sit above reckless or spammy accounts."
  },
  {
    id: "whale",
    label: "Whale snipe",
    headline: "One huge trade should not auto-win",
    summary:
      "Simulates a late-stage whale trying to jump the board with a single oversized trade.",
    whatToVerify:
      "The score cap should reduce one-shot leaderboard sniping compared with pure PnL races.",
    transformTrades: (trades) => [
      ...trades,
      {
        id: "scenario-whale-1",
        traderId: "t2",
        market: "BTC-PERP",
        side: "long",
        notionalUsd: 1_250_000,
        pnlUsd: 41_000,
        feesUsd: 950,
        fundingUsd: -220,
        durationMinutes: 18,
        leverage: 9,
        isLiquidation: false,
        isWashLike: false,
        timestamp: "2026-03-17T22:40:00Z"
      }
    ]
  },
  {
    id: "wash",
    label: "Wash attack",
    headline: "Volume spam should look bad, not strong",
    summary:
      "Adds more repeated short-duration churn from an abusive trader to test the anti-spam logic.",
    whatToVerify:
      "Flagged high-volume churn should stay visually obvious and remain uncompetitive on score.",
    transformTrades: (trades) => [
      ...trades,
      {
        id: "scenario-wash-1",
        traderId: "t4",
        market: "SOL-PERP",
        side: "short",
        notionalUsd: 21_000,
        pnlUsd: 610,
        feesUsd: 47,
        fundingUsd: 4,
        durationMinutes: 9,
        leverage: 34,
        isLiquidation: false,
        isWashLike: true,
        timestamp: "2026-03-17T03:10:00Z"
      },
      {
        id: "scenario-wash-2",
        traderId: "t4",
        market: "SOL-PERP",
        side: "long",
        notionalUsd: 20_400,
        pnlUsd: 520,
        feesUsd: 46,
        fundingUsd: -6,
        durationMinutes: 8,
        leverage: 35,
        isLiquidation: false,
        isWashLike: true,
        timestamp: "2026-03-17T03:19:00Z"
      }
    ]
  },
  {
    id: "strict",
    label: "Strict mode",
    headline: "Tighter risk guardrails",
    summary:
      "Raises penalties and lowers repeat-trade allowance to show how Adrena can tune the mode without redesigning it.",
    whatToVerify:
      "Abusive behavior should collapse faster, while consistent traders remain competitive.",
    configPatch: {
      maxTradesCountedPerMarket: 2,
      maxScorePerTrade: 110,
      liquidationPenalty: 120,
      washTradePenalty: 85
    }
  }
];

const journeyCards = [
  {
    label: "Trader journey",
    title: "Join, trade, climb, collect",
    points: [
      "Opt into a 72-hour sprint from the existing Adrena competitions surface.",
      "Trade normally through Adrena's current quote and transaction flow.",
      "See division rank updates, quest bonuses, and final reward status."
    ]
  },
  {
    label: "Operator journey",
    title: "Configure, monitor, reward",
    points: [
      "Launch a sprint with division rules, reward weights, and anti-abuse thresholds.",
      "Monitor flagged wallets, liquidation-heavy behavior, and distribution by division.",
      "Publish final standings into leaderboard, streak, quest, and raffle systems."
    ]
  }
];

const apiCards = [
  {
    title: "Public trading API",
    detail:
      "Confirmed base URL: https://datapi.adrena.trade. Public quote endpoints can prepare serialized transactions for callers to sign and submit."
  },
  {
    title: "Confirmed endpoints",
    detail:
      "The published Postman doc includes add-liquidity, remove-liquidity, and open-long flows, which proves a real integration surface exists today."
  },
  {
    title: "Internal adapter boundary",
    detail:
      "Competition snapshots then plug into Adrena-only systems: leaderboard, quests, streaks, and raffles."
  }
];

const cloneTrades = (trades: ClosedTrade[]) => trades.map((trade) => ({ ...trade }));

const integrationNotes = [
  "Closed-trade events flow from Adrena's indexer into a scoring service.",
  "The service snapshots standings, flags abuse, and returns division leaderboards.",
  "Quests, streaks, and raffles consume the same snapshots so rewards stay coherent."
];

const abuseRules = [
  "Sub-threshold notional is ignored.",
  "Repeated same-market churn is capped.",
  "Liquidations incur hard penalties.",
  "Excess leverage receives a haircut.",
  "Flagged wallets can be shadow-reviewed without pausing the competition."
];

const divisions: Array<DivisionTier | "All"> = ["All", "Rookie", "Challenger", "Pro"];
const divisionOrder: DivisionTier[] = ["Rookie", "Challenger", "Pro"];

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1
  }).format(value);

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);

function App() {
  const [config, setConfig] = useState(defaultLeagueConfig);
  const [selectedScenario, setSelectedScenario] = useState("baseline");
  const [selectedDivision, setSelectedDivision] = useState<DivisionTier | "All">(
    "All"
  );
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const activeScenario =
    scenarioPresets.find((scenario) => scenario.id === selectedScenario) ??
    scenarioPresets[0]!;
  const activeTrades = activeScenario.transformTrades
    ? activeScenario.transformTrades(cloneTrades(closedTrades))
    : closedTrades;
  const effectiveConfig = {
    ...config,
    ...activeScenario.configPatch
  };

  const leaderboard = scoreCompetition(traderProfiles, activeTrades, effectiveConfig);
  const divisionBreakdown = scoreByDivision(
    traderProfiles,
    activeTrades,
    effectiveConfig
  );
  const filteredLeaderboard = leaderboard.filter((entry) => {
    const matchesDivision =
      selectedDivision === "All" || entry.trader.division === selectedDivision;
    const matchesSearch = entry.trader.handle
      .toLowerCase()
      .includes(deferredSearch.toLowerCase());

    return matchesDivision && matchesSearch;
  });

  const visibleDivisionBoards = divisionOrder
    .map((division) => ({
      division,
      entries: filteredLeaderboard.filter((entry) => entry.trader.division === division)
    }))
    .filter((board) => selectedDivision === "All" || board.division === selectedDivision);

  const totalVolume = filteredLeaderboard.reduce(
    (sum, entry) => sum + entry.eligibleVolumeUsd,
    0
  );
  const totalFlags = filteredLeaderboard.reduce(
    (sum, entry) => sum + entry.flags.length,
    0
  );
  const flaggedTraders = filteredLeaderboard.filter((entry) => entry.flags.length > 0).length;
  const featuredTrader =
    leaderboard.find((entry) => entry.trader.handle === "quiet.quants") ?? leaderboard[0];
  const featuredRank = leaderboard.findIndex(
    (entry) => entry.trader.id === featuredTrader?.trader.id
  );
  const topDivisionLeads = divisionOrder.map((division) => {
    const lead = divisionBreakdown.get(division)?.[0];

    return {
      division,
      lead
    };
  });

  const updateConfig = (key: ConfigField, value: number) => {
    startTransition(() => {
      setConfig((current) => ({
        ...current,
        [key]: value
      }));
    });
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="topbar fade-up" style={{ animationDelay: "20ms" }}>
        <div className="brand-block">
          <span className="brand-mark">A</span>
          <div>
            <strong>Adrena x Autonom</strong>
            <p>Competition module concept</p>
          </div>
        </div>
        <div className="topbar-meta">
          <span>72h sprint</span>
          <span>Division matched</span>
          <span>Closed-trade scoring</span>
        </div>
      </header>

      <main className="stack">
        <section className="hero-grid">
          <div className="hero-card fade-up" style={{ animationDelay: "80ms" }}>
            <p className="eyebrow">A better competition loop for perp trading</p>
            <h1>Make skill visible. Make the sprint feel winnable.</h1>
            <p className="hero-copy">
              Sprint Leagues is a short-form competition system for Adrena. It shifts
              the game away from whale-only ladders and toward division-based races
              where realized performance, consistency, and platform engagement all
              matter.
            </p>

            <div className="hero-tags">
              <span>Rookie / Challenger / Pro</span>
              <span>Quest and streak aware</span>
              <span>Anti-abuse scoring</span>
            </div>

            <div className="hero-proof">
              <article>
                <span>Eligible volume</span>
                <strong>{formatUsd(totalVolume)}</strong>
              </article>
              <article>
                <span>Closed trades indexed</span>
                <strong>{activeTrades.length}</strong>
              </article>
              <article>
                <span>Current flags surfaced</span>
                <strong>{totalFlags}</strong>
              </article>
            </div>
          </div>

          <div className="sprint-card fade-up" style={{ animationDelay: "140ms" }}>
            <div className="section-cap">Current sprint preview</div>
            <div className="sprint-header">
              <div>
                <h2>Week 12 · Solana majors</h2>
                <p>{competitionMeta.format}</p>
              </div>
              <span className="status-dot">Live</span>
            </div>

            <div className="sprint-stats">
              <article>
                <span>Countdown</span>
                <strong>28h 14m</strong>
              </article>
              <article>
                <span>Prize lanes</span>
                <strong>3 divisions</strong>
              </article>
              <article>
                <span>Reward hooks</span>
                <strong>Quests + streaks</strong>
              </article>
            </div>

            <div className="timeline">
              <div className="timeline-step active">
                <strong>Entry open</strong>
                <span>Traders join a bracket</span>
              </div>
              <div className="timeline-step active">
                <strong>Mid-sprint pulse</strong>
                <span>Leaderboard update + quest push</span>
              </div>
              <div className="timeline-step">
                <strong>Close and reward</strong>
                <span>Podium, boosts, raffle weight</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flow-grid fade-up" style={{ animationDelay: "180ms" }}>
          {experienceSteps.map((item) => (
            <article key={item.step} className="flow-card">
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section className="test-lab fade-up" style={{ animationDelay: "200ms" }}>
          <div className="section-head compact">
            <div>
              <p className="eyebrow">Solo testing flow</p>
              <h2>Run the submission under pressure</h2>
            </div>
          </div>

          <div className="scenario-layout">
            <div className="scenario-list">
              {scenarioPresets.map((scenario) => (
                <button
                  key={scenario.id}
                  className={
                    scenario.id === selectedScenario
                      ? "scenario-card active"
                      : "scenario-card"
                  }
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <span>{scenario.label}</span>
                  <strong>{scenario.headline}</strong>
                  <p>{scenario.summary}</p>
                </button>
              ))}
            </div>

            <div className="scenario-detail">
              <div className="scenario-meta">
                <article>
                  <span>Current scenario</span>
                  <strong>{activeScenario.headline}</strong>
                </article>
                <article>
                  <span>Flagged traders</span>
                  <strong>{flaggedTraders}</strong>
                </article>
                <article>
                  <span>What to verify</span>
                  <strong>{activeScenario.whatToVerify}</strong>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="board-panel fade-up" style={{ animationDelay: "220ms" }}>
          <div className="section-head">
            <div>
              <p className="eyebrow">Trader-facing view</p>
              <h2>Parallel division boards</h2>
            </div>
            <div className="control-strip">
              <label className="search-box">
                <span>Search handle</span>
                <input
                  type="search"
                  placeholder="quiet.quants"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="segment-control" aria-label="Division filter">
                {divisions.map((division) => (
                  <button
                    key={division}
                    className={
                      division === selectedDivision ? "segment active" : "segment"
                    }
                    onClick={() => setSelectedDivision(division)}
                  >
                    {division}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="division-boards">
            {visibleDivisionBoards.map((board, boardIndex) => (
              <section
                key={board.division}
                className="division-column"
                style={{ animationDelay: `${280 + boardIndex * 60}ms` }}
              >
                <header className="division-head">
                  <div>
                    <p>{board.division}</p>
                    <h3>
                      {board.entries.length > 0
                        ? `${board.entries.length} active traders`
                        : "No matching traders"}
                    </h3>
                  </div>
                  <span>Lead {formatNumber(board.entries[0]?.totalScore ?? 0)}</span>
                </header>

                <div className="division-list">
                  {board.entries.map((entry, index) => (
                    <article className="rank-card" key={entry.trader.id}>
                      <div className="rank-head">
                        <span className="rank-badge">#{index + 1}</span>
                        <span className="pill-lite">{entry.trader.division}</span>
                      </div>

                      <div className="rank-copy">
                        <h4>{entry.trader.handle}</h4>
                        <p>
                          Quest +{entry.questBonus} · Streak +{entry.streakBonus}
                        </p>
                      </div>

                      <div className="rank-metrics">
                        <article>
                          <span>Score</span>
                          <strong>{formatNumber(entry.totalScore)}</strong>
                        </article>
                        <article>
                          <span>Adj. PnL</span>
                          <strong>{formatUsd(entry.adjustedPnlUsd)}</strong>
                        </article>
                        <article>
                          <span>Volume</span>
                          <strong>{formatCompact(entry.eligibleVolumeUsd)}</strong>
                        </article>
                      </div>

                      <div className="flag-row">
                        {entry.flags.length > 0 ? (
                          entry.flags.map((flag) => (
                            <span className="flag-chip warning" key={flag}>
                              {flag}
                            </span>
                          ))
                        ) : (
                          <span className="flag-chip clean">no risk flags</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="insights-grid">
          <section className="insight-card fade-up" style={{ animationDelay: "240ms" }}>
            <div className="section-cap">Why it feels fair</div>
            <h3>One sample trader, one readable story</h3>

            <div className="featured-card">
              <div className="featured-head">
                <div>
                  <p>Tracked profile</p>
                  <strong>{featuredTrader?.trader.handle}</strong>
                </div>
                <span>Rank #{featuredRank + 1}</span>
              </div>

              <div className="featured-grid">
                <article>
                  <span>Division</span>
                  <strong>{featuredTrader?.trader.division}</strong>
                </article>
                <article>
                  <span>Score</span>
                  <strong>{formatNumber(featuredTrader?.totalScore ?? 0)}</strong>
                </article>
                <article>
                  <span>Adj. PnL</span>
                  <strong>{formatUsd(featuredTrader?.adjustedPnlUsd ?? 0)}</strong>
                </article>
                <article>
                  <span>Signals</span>
                  <strong>
                    {featuredTrader?.flags.length ? "reviewed" : "clean execution"}
                  </strong>
                </article>
              </div>
            </div>
          </section>

          <section className="insight-card fade-up" style={{ animationDelay: "300ms" }}>
            <div className="section-cap">Scoring pillars</div>
            <div className="pillar-list">
              {scoringPillars.map((pillar) => (
                <article key={pillar.label}>
                  <strong>{pillar.label}</strong>
                  <p>{pillar.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="insight-card fade-up" style={{ animationDelay: "360ms" }}>
            <div className="section-cap">Why this is stronger</div>
            <div className="comparison-stack">
              {comparisonMetrics.map((metric) => (
                <article key={metric.label}>
                  <div className="comparison-head">
                    <strong>{metric.label}</strong>
                    <span>{metric.label === "Sprint Leagues" ? "Preferred" : "Legacy"}</span>
                  </div>
                  <p>{metric.summary}</p>
                  <small>{metric.weakness}</small>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="journey-grid fade-up" style={{ animationDelay: "390ms" }}>
          {journeyCards.map((card) => (
            <article className="journey-card" key={card.title}>
              <span className="section-cap">{card.label}</span>
              <h3>{card.title}</h3>
              <ul className="clean-list">
                {card.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="lower-grid">
          <section className="detail-panel fade-up" style={{ animationDelay: "420ms" }}>
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Product effects</p>
                <h2>Rewards that fit the Adrena loop</h2>
              </div>
            </div>

            <div className="reward-grid">
              {rewardLanes.map((reward) => (
                <article key={reward.title}>
                  <strong>{reward.title}</strong>
                  <p>{reward.detail}</p>
                </article>
              ))}
            </div>

            <div className="lead-strip">
              {topDivisionLeads.map(({ division, lead }) => (
                <article key={division}>
                  <span>{division}</span>
                  <strong>{lead?.trader.handle ?? "No leader"}</strong>
                  <small>{formatNumber(lead?.totalScore ?? 0)} score</small>
                </article>
              ))}
            </div>
          </section>

          <section className="detail-panel fade-up" style={{ animationDelay: "480ms" }}>
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Operational design</p>
                <h2>Abuse prevention and integration</h2>
              </div>
            </div>

            <div className="two-list-grid">
              <div>
                <span className="mini-title">Abuse controls</span>
                <ul className="clean-list">
                  {abuseRules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="mini-title">Integration path</span>
                <ul className="clean-list">
                  {integrationNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </section>

        <section className="api-grid fade-up" style={{ animationDelay: "520ms" }}>
          {apiCards.map((card) => (
            <article className="api-card" key={card.title}>
              <span className="section-cap">Integration card</span>
              <strong>{card.title}</strong>
              <p>{card.detail}</p>
            </article>
          ))}
        </section>

        <details className="appendix fade-up" style={{ animationDelay: "560ms" }}>
          <summary>
            <span>Operator appendix</span>
            <small>Keep the product view clean, but show tunable rules for reviewers.</small>
          </summary>

          <div className="appendix-body">
            <div className="slider-column">
              {configSliders.map((slider) => (
                <label className="appendix-slider" key={slider.key}>
                  <div className="appendix-head">
                    <span>{slider.label}</span>
                    <strong>
                      {slider.key.includes("Usd")
                        ? formatUsd(config[slider.key] as number)
                        : formatNumber(config[slider.key] as number)}
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={config[slider.key]}
                    onChange={(event) =>
                      updateConfig(slider.key, Number(event.target.value))
                    }
                  />
                </label>
              ))}
            </div>

            <div className="appendix-note">
              <p className="mini-title">Why these controls stay in the appendix</p>
              <p>
                The main interface should sell the experience, not the parameters.
                Judges still need proof that the scoring model is deterministic and
                tunable, so the controls are available without dominating the page.
              </p>
            </div>
          </div>
        </details>
      </main>
    </div>
  );
}

export default App;
