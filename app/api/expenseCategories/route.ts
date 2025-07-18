import { ExpenseCategory } from "@/features/category/schemas/expenseCategory";
import {
  handleCategoryGET,
  handleCategoryPOST,
  handleCategoryDELETE,
  handleCategoryPATCH,
  BaseCategoryHandlerConfig,
} from "../baseCategoryHandler";

const expenseCategoryConfig: BaseCategoryHandlerConfig = {
  categoryModel: ExpenseCategory,
  userCategoryField: "expenseCategories",
};

export const GET = () => handleCategoryGET(expenseCategoryConfig);
export const POST = (req: Request) =>
  handleCategoryPOST(req, expenseCategoryConfig);
export const DELETE = (req: Request) =>
  handleCategoryDELETE(req, expenseCategoryConfig);
export const PATCH = (req: Request) =>
  handleCategoryPATCH(req, expenseCategoryConfig);
