import { api } from "./api";

export type TotalsResponse = {
  currency: string;
  walletBalance: number;
  expenseTotal?: number;
  expenseCount?: number;
  incomeTotal?: number;
  incomeCount?: number;
  netAmount?: number;
};

export type TotalsParams = {
  walletId: string;
  type?: "expense" | "income" | "both";
  category?: string;
  amountStart?: number;
  amountEnd?: number;
  title?: string;
  dateStart?: string;
  dateEnd?: string;
};

export type TotalsFilters = Omit<TotalsParams, "walletId" | "type">;

const buildSearchParams = (params: TotalsParams): Record<string, string> => {
  const searchParams: Record<string, string> = {};

  // Required params
  searchParams.walletId = params.walletId;

  // Optional params
  if (params.type) searchParams.type = params.type;
  if (params.category) searchParams.category = params.category;
  if (params.amountStart)
    searchParams.amountStart = params.amountStart.toString();
  if (params.amountEnd) searchParams.amountEnd = params.amountEnd.toString();
  if (params.title) searchParams.title = params.title;
  if (params.dateStart) searchParams.dateStart = params.dateStart;
  if (params.dateEnd) searchParams.dateEnd = params.dateEnd;

  return searchParams;
};

export const totalsService = {
  getTotals: async (params: TotalsParams): Promise<TotalsResponse> => {
    const searchParams = buildSearchParams(params);
    return api.GET<TotalsResponse>("/api/totals", searchParams);
  },

  getExpenseTotals: async (
    walletId: string,
    filters?: TotalsFilters
  ): Promise<TotalsResponse> => {
    return totalsService.getTotals({ walletId, type: "expense", ...filters });
  },

  getIncomeTotals: async (
    walletId: string,
    filters?: TotalsFilters
  ): Promise<TotalsResponse> => {
    return totalsService.getTotals({ walletId, type: "income", ...filters });
  },

  getAllTotals: async (
    walletId: string,
    filters?: TotalsFilters
  ): Promise<TotalsResponse> => {
    return totalsService.getTotals({ walletId, type: "both", ...filters });
  },
};
