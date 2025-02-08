import {api} from "@/app/services/api";
import {Category} from "@/types/Category";
import {endpoints} from "@/app/services/endpoints";
import {ResponseWithArray} from "@/types/Service";

const getAll = async () => {
    return api.GET<ResponseWithArray<Category>>(endpoints.incomeCategory)
}
const add = async (category: Category) => {
    return api.POST<Category>(endpoints.incomeCategory, category)
}

const remove = async (_id: string) => {
    return api.DELETE<{ _id: string }>(endpoints.incomeCategory, {_id})
}
const patch = async (data: Partial<Category>) => {
    return api.PATCH<Category>(endpoints.incomeCategory, {...data});
}

export const incomeCategoriesService = {
    getAll, add, remove, patch
}
