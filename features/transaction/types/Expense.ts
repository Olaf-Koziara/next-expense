import { z } from "zod";
import {
  ExpenseSchema,
  SummedExpenseByCategorySchema,
} from "../schemas/expene";

export type Expense = z.infer<typeof ExpenseSchema>;

export const SummedExpenseByCategoryArraySchema = z.array(
  SummedExpenseByCategorySchema
);
export type SummedExpenseByCategory = z.infer<
  typeof SummedExpenseByCategorySchema
>;

export type ExpenseWithWalletId = Expense & { walletId: string };
export type TransactionType = "expense" | "income";
