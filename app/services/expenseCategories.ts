import { Category } from "@/types/Category";
import { endpoints } from "@/app/services/endpoints";
import { Service } from "@/types/Service";
import { createCategoryService } from "./categoryService";

export const expenseCategoriesService: Service<Category> =
  createCategoryService(endpoints.expenseCategory);
