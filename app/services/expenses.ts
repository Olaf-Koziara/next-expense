import {Expense} from "@/types/Expense";
import {api, QueryParams} from "@/app/services/api";
import {endpoints} from "@/app/services/endpoints";

const getAll = async (walletId: string, params?: QueryParams): Promise<Expense[]> => {

    return api.GET<Expense[]>(endpoints.expense, {wallet: walletId, ...params})
}
type AddExpenseData = {
    selectedWalletId: string,
} & Expense;
const add = async (walletId: string, expense: Expense) => {
    return api.POST<AddExpenseData>(endpoints.expense, {selectedWalletId: walletId, ...expense})
}
const remove = async (walletId: string, expenseId: string) => {
    return api.DELETE<{ walletId: string, _id: string }>(endpoints.expense, {walletId: walletId, _id: expenseId})
}
export const expensesService = {
    getAll, add, remove
}
