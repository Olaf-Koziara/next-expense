import {api} from "@/app/services/api";
import {Income} from "@/types/Income";
import {endpoints} from "@/app/services/endpoints";

const getAll = async (walletId: string): Promise<Income[]> => {
    return api.GET<Income[]>(endpoints.income)
}
type AddIncomeData = {
    selectedWalletId: string,
} & Income;
const add = async (walletId: string, income: Income) => {
    return api.POST<AddIncomeData, void>(endpoints.income, {selectedWalletId: walletId, ...income})
}
const deleteOne = async (walletId: string, expenseId: string) => {
    return api.DELETE<{ walletId: string, _id: string }, void>(endpoints.income, {walletId: walletId, _id: expenseId})
}
export const incomesService = {
    getAll, add, deleteOne
}