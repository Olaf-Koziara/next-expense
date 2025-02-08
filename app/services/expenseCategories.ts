import {api} from "@/app/services/api";
import {Category} from "@/types/Category";
import {endpoints} from "@/app/services/endpoints";
import {ResponseWithArray, Service} from "@/types/Service";

const getAll = async () => {
    return api.GET<ResponseWithArray<Category>>(endpoints.expenseCategory)
}
const add = async (category: Category) => {
    return api.POST<Category>(endpoints.expenseCategory, category)
}
const remove = async (_id: string) => {
    return api.DELETE<{ _id: string }>(endpoints.expenseCategory, {_id})
}
const patch = async (data: Partial<Category>) => {
    return api.PATCH<Category>(endpoints.expenseCategory, {...data});
}

export const expenseCategoriesService: Service<Category> = {
    getAll, add, remove, patch
}
