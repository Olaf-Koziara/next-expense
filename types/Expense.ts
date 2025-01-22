export type Expense = {
    title: string,
    amount: number,
    category: string,
    date: Date,
}
export type SummedExpenseByCategory = {
    category: string,
    total: number
}