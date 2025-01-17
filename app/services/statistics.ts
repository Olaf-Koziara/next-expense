import {api} from "@/app/services/api";
import {endpoints} from "@/app/services/endpoints";
import {WalletStats} from "@/types/Stats";

const getAll = async (walletId: string) => {
    return api.GET<WalletStats>(endpoints.stats, `wallet=${walletId}`);
}
export const statisticsService = {
    getAll
}