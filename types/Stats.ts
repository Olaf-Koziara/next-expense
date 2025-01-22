export type WalletStats = {
    highestExpenseCategory: CategoryTotal,
    highestIncomeCategory: CategoryTotal,
    sumExpenseCategories: CategoryTotal[],
    sumIncomeCategories: CategoryTotal[]
}
export type CategoryTotal = { category: string, total: number };

