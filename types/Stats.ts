export type WalletStats = {
    highestExpenseCategory: CategoryTotal,
    highestIncomeCategory: CategoryTotal,
    summedExpenseCategories: CategoryTotal[],
    summedIncomeCategories: CategoryTotal[]
    summedExpenseCategoriesAndDate: CategoryDateTotal[]
    summedIncomeCategoriesAndDate: CategoryDateTotal[]
}
export type CategoryTotal = { category: string };
export type CategoryDateTotal = { category: string, date: string, amount: number };

