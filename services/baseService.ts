import { api, QueryParams } from "./api";
import { ResponseWithArray, Service } from "@/types/Service";
import { Dictionary } from "@/utils/global";

export function createBaseService<T>(endpoint: string): Service<T> {
  const getAll = async (params: QueryParams, walletId?: string) => {
    const queryParams = walletId ? { walletId, ...params } : params;
    return api.GET<ResponseWithArray<T>>(endpoint, queryParams);
  };

  const add = async (data: T, walletId?: string): Promise<void> => {
    const payload = walletId ? { walletId, ...data } : data;
    return api.POST<T & Dictionary>(endpoint, payload as T & Dictionary);
  };

  const remove = async (_id: string, walletId?: string): Promise<void> => {
    const payload = walletId ? { walletId, _id } : { _id };
    return api.DELETE<{ walletId?: string; _id: string }>(endpoint, payload);
  };

  const patch = async (data: Partial<T>, walletId?: string): Promise<T> => {
    const payload = walletId ? { ...data, walletId } : data;
    return api.PATCH<T>(endpoint, payload as Partial<T> & Dictionary);
  };

  const put = async (data: T): Promise<T> => {
    return api.PUT<T>(endpoint, { ...data });
  };

  return {
    getAll,
    add,
    remove,
    patch,
    put,
  };
}
