export type Expense = {
    _id: string,
    title: string,
    amount: number,
    category: string,
    date: Date,
}
export type SummedExpenseByCategory = {
    category: string,
    total: number
}
export type ExpenseWithWalletId = Expense & { walletId: string };