const ADRENA_API_BASE_URL = "https://datapi.adrena.trade";

export type PreparedTransactionResponse<TQuote> = {
  success: boolean;
  error: string | null;
  data: {
    quote: TQuote;
    transaction: string;
  };
};

export type AddLiquidityQuote = {
  inputAmount: number;
  inputToken: string;
  outputAmount: number;
  outputToken: string;
  fee: number;
};

export type RemoveLiquidityQuote = {
  inputAmount: number;
  inputToken: string;
  outputAmount: number;
  outputToken: string;
  fee: number;
};

export type OpenLongQuote = {
  collateralAmount: number;
  collateralToken: string;
  token: string;
  leverage: number;
  size: number;
  entryPrice: number;
  liquidationPrice: number;
  fee: number;
  takeProfit?: number;
  stopLoss?: number;
};

const buildUrl = (path: string, query: Record<string, string | number | undefined>) => {
  const url = new URL(path, ADRENA_API_BASE_URL);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
};

export const buildAddLiquidityUrl = (params: {
  account: string;
  amount: number;
  tokenSymbol: string;
}) => buildUrl("/add-liquidity", params);

export const buildRemoveLiquidityUrl = (params: {
  account: string;
  amount: number;
  receivingTokenSymbol: string;
}) => buildUrl("/remove-liquidity", params);

export const buildOpenLongUrl = (params: {
  account: string;
  collateralAmount: number;
  collateralTokenSymbol: string;
  tokenSymbol: string;
  leverage: number;
  takeProfit?: number;
  stopLoss?: number;
}) => buildUrl("/open-long", params);

export {
  ADRENA_API_BASE_URL
};
