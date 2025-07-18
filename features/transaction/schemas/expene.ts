import { z } from "zod";

export const ExpenseSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.date(),
  currency: z.string().optional(),
});
export const ExpenseArraySchema = z.array(ExpenseSchema);
export const SummedExpenseByCategorySchema = z.object({
  category: z.string(),
  total: z.number(),
});
