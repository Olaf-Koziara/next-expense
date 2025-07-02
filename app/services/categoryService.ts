import { api } from "@/app/services/api";
import { Category } from "@/types/Category";
import { ResponseWithArray, Service } from "@/types/Service";

export function createCategoryService(endpoint: string): Service<Category> {
  const getAll = async () => {
    return api.GET<ResponseWithArray<Category>>(endpoint);
  };

  const add = async (category: Category) => {
    return api.POST<Category>(endpoint, category);
  };

  const remove = async (_id: string) => {
    return api.DELETE<{ _id: string }>(endpoint, { _id });
  };

  const patch = async (data: Partial<Category>) => {
    return api.PATCH<Category>(endpoint, { ...data });
  };

  const put = async (data: Category) => {
    return api.PUT<Category>(endpoint, { ...data });
  };

  return {
    getAll,
    add,
    remove,
    patch,
    put,
  };
}
