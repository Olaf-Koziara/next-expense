import {Expense} from "@/types/Expense";

export type Income = Expense;
export type Transaction = Income | Expense;
export type TransactionType = 'income' | 'expense';