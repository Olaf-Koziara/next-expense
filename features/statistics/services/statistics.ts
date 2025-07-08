import { api, QueryParams } from "@/components/services/api";
import { endpoints } from "@/components/services/endpoints";
import { WalletStats } from "@/features/statistics/types/Stats";

const getAll = async (walletId: string, params: QueryParams) => {
  return api.GET<WalletStats>(endpoints.stats, { ...params, walletId });
};
export const statisticsService = {
  getAll,
};
