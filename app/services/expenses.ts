import { Expense } from "@/types/Expense";
import { endpoints } from "@/app/services/endpoints";
import { Service } from "@/types/Service";
import { createBaseService } from "./baseService";

export const expensesService: Service<Expense> = createBaseService<Expense>(
  endpoints.expense
);
