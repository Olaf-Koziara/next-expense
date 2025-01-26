import {api, QueryParams} from "@/app/services/api";
import {Income} from "@/types/Income";
import {endpoints} from "@/app/services/endpoints";
import {Expense} from "@/types/Expense";

const getAll = async (walletId: string, params?: QueryParams): Promise<Income[]> => {

    return api.GET<Income[]>(endpoints.income, {wallet: walletId, ...params})
}
type AddIncomeData = {
    selectedWalletId: string,
} & Income;
const add = async (walletId: string, income: Income) => {
    return api.POST<AddIncomeData>(endpoints.income, {selectedWalletId: walletId, ...income})
}
const remove = async (walletId: string, _id: string) => {
    return api.DELETE<{ walletId: string, _id: string }>(endpoints.income, {walletId: walletId, _id})
}
export const incomesService = {
    getAll, add, remove
}
