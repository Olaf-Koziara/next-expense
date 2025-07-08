import { createBaseService } from "@/services/baseService";
import { endpoints } from "@/services/endpoints";
import { Service } from "@/types/Service";
import { Expense } from "../types/Expense";

export const expensesService: Service<Expense> = createBaseService<Expense>(
  endpoints.expense
);
