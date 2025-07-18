import { Category } from "@/features/category/types/Category";
import { endpoints } from "@/services/endpoints";
import { Service } from "@/types/Service";
import { createCategoryService } from "./baseCategories";

export const expenseCategoriesService: Service<Category> =
  createCategoryService(endpoints.expenseCategory);
