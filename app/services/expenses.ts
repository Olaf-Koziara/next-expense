import {Expense} from "@/types/Expense";
import {api} from "@/app/services/api";
import {endpoints} from "@/app/services/endpoints";

const getAll = async (walletId: string): Promise<Expense[]> => {
    return api.GET<Expense[]>(endpoints.expense)
}
type AddExpenseData = {
    selectedWalletId: string,
} & Expense;
const add = async (walletId: string, expense: Expense) => {
    return api.POST<AddExpenseData, void>(endpoints.expense, {selectedWalletId: walletId, ...expense})
}
const deleteOne = async (walletId: string, expenseId: string) => {
    return api.DELETE<{ walletId: string, _id: string }, void>(endpoints.expense, {walletId: walletId, _id: expenseId})
}
export const expensesService = {
    getAll, add, deleteOne
}