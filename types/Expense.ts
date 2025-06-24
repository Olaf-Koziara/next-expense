import {z} from "zod";

export type Expense = z.infer<typeof ExpenseSchema>;
export const ExpenseSchema = z.object({
    _id: z.string().optional(),
    title: z.string(),
    amount: z.number(),
    category: z.string(),
    date: z.date(),
    currency: z.string().optional(),
})
export const ExpenseArraySchema = z.array(ExpenseSchema);
export const SummedExpenseByCategorySchema = z.object({
    category: z.string(),
    total: z.number()
})
export const SummedExpenseByCategoryArraySchema = z.array(SummedExpenseByCategorySchema);
export type SummedExpenseByCategory = z.infer<typeof SummedExpenseByCategorySchema>;

export type ExpenseWithWalletId = Expense & { walletId: string };
export type TransactionType = 'expense' | 'income';