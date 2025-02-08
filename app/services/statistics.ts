import {api, QueryParams} from "@/app/services/api";
import {endpoints} from "@/app/services/endpoints";
import {WalletStats} from "@/types/Stats";

const getAll = async (walletId: string, params: QueryParams) => {
    return api.GET<WalletStats>(endpoints.stats, {...params, walletId});
}
export const statisticsService = {
    getAll
}