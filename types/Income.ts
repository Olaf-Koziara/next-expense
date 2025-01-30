import {Expense, ExpenseArraySchema, ExpenseSchema} from "@/types/Expense";

export type Income = Expense;
export const IncomeSchema = ExpenseSchema;
export const IncomeArraySchema = ExpenseArraySchema;