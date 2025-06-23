import { IncomeCategory } from "@/models/incomeCategory";
import {
  handleCategoryGET,
  handleCategoryPOST,
  handleCategoryDELETE,
  handleCategoryPATCH,
  BaseCategoryHandlerConfig,
} from "../baseCategoryHandler";

const incomeCategoryConfig: BaseCategoryHandlerConfig = {
  categoryModel: IncomeCategory,
  userCategoryField: "incomeCategories",
};

export const GET = () => handleCategoryGET(incomeCategoryConfig);
export const POST = (req: Request) =>
  handleCategoryPOST(req, incomeCategoryConfig);
export const DELETE = (req: Request) =>
  handleCategoryDELETE(req, incomeCategoryConfig);
export const PATCH = (req: Request) =>
  handleCategoryPATCH(req, incomeCategoryConfig);
